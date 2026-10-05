import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { config, ROOT } from './config.mjs';
import { Store } from './store.mjs';
import { Engine, AppError, requireThat } from './engine.mjs';
import { SolanaCustody } from './solana.mjs';

export async function start(cfg=config(),{store:givenStore, chain:givenChain}={}) {
  const store=givenStore||new Store(cfg.db);
  const chain=givenChain||(cfg.mode==='devnet'?new SolanaCustody(cfg):null);
  const chainInfo=chain?await chain.check():null;
  const engine=new Engine(store,cfg,chain);engine.recover();
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.devnet.solana.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    const send=(data,status=200)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));};
    try {
      const url=new URL(req.url,'http://localhost');
      if(url.pathname==='/healthz'){send({ok:true,app:'commit-worldsfair',mode:cfg.mode});return;}
      if(!url.pathname.startsWith('/api/')) {
        requireThat(req.method==='GET','Method not allowed.',405);
        const name=url.pathname==='/'?'index.html':url.pathname.slice(1);
        requireThat(/^(index\.html|app\.js|style\.css|assets\/[a-z0-9_.-]+\.(png|svg|jpg))$/.test(name),'Not found.',404);
        const file=join(ROOT,'dist',name);requireThat(existsSync(file),'Frontend missing. Run npm run build.',404);
        res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'})[extname(file)]);res.end(readFileSync(file));return;
      }
      let sid=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('commit_wf_sid='))?.slice(14);
      let row=sid&&store.session(sid);
      if(!row) {
        requireThat(req.method==='GET'&&url.pathname==='/api/state','Refresh the page to start a session.',401);
        sid=randomBytes(32).toString('hex');store.createSession(sid,randomBytes(32).toString('hex'),{balanceMicros:10_000_000,providerEarnedMicros:0});row=store.session(sid);
        res.setHeader('Set-Cookie',`commit_wf_sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${cfg.origin.startsWith('https:')?'; Secure':''}`);
      }
      let body={};
      if(req.method==='POST') {
        requireThat(req.headers.origin===cfg.origin,'Request origin is not allowed.',403);
        requireThat(req.headers['x-csrf-token']===row.csrf,'Session verification failed.',403);
        requireThat(req.headers['content-type']?.split(';')[0]==='application/json','JSON is required.',415);
        let raw='';for await(const chunk of req){raw+=chunk;requireThat(raw.length<20_000,'Request too large.',413);}try{body=JSON.parse(raw||'{}');}catch{throw new AppError('Invalid JSON.',400);}
      } else requireThat(req.method==='GET','Method not allowed.',405);
      if(req.method==='GET'&&url.pathname==='/api/state') {send({mode:cfg.mode,csrf:row.csrf,balance:JSON.parse(row.data),slots:engine.slots(),reservations:store.allReservations().filter(r=>r.session===sid&&r.mode===cfg.mode).map(r=>engine.public(r)),chain:chainInfo,rpc:cfg.rpc,now:Date.now()});return;}
      if(req.method==='POST'&&url.pathname==='/api/quote'){send(engine.quote(sid,body));return;}
      if(req.method==='POST'&&url.pathname==='/api/reserve'){send(await engine.reserve(sid,body));return;}
      const match=/^\/api\/reservations\/(r_[0-9a-f-]{36})\/(fund|open-window|execute|verify|finish|deposit-transaction|evidence)$/.exec(url.pathname);
      requireThat(match,'Endpoint not found.',404);const [,id,action]=match;
      if(action==='evidence'){requireThat(req.method==='GET','Method not allowed.',405);send({schema:'commit.worldsfair.evidence.v1',...engine.public(engine.get(sid,id))});return;}
      requireThat(req.method==='POST','Method not allowed.',405);
      if(action==='deposit-transaction'){requireThat(chain,'Use Devnet mode for real test transactions.',409);const r=engine.get(sid,id);requireThat(r.status==='reserved','This reservation is already funded.');send(await chain.depositTransaction(r));return;}
      const result=action==='open-window'?engine.openWindow(sid,id):action==='verify'?engine.verify(sid,id):await engine[action](sid,id,body);
      send(result);
    }catch(e){send({error:e.status?e.message:'Action could not complete. Funds and records were preserved; check the server log and retry.'},e.status||503);if(!e.status)console.error(e.message);}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(cfg.port,cfg.host,resolve);});
  console.log(`Commit World's Fair: ${cfg.origin} (${cfg.mode})`);
  return {server,engine,store};
}
if(process.argv[1]===new URL(import.meta.url).pathname) {start().catch(e=>{console.error(e.message);process.exitCode=1;});}
