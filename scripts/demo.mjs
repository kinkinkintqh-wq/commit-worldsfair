import { Store } from '../server/store.mjs';import { Engine } from '../server/engine.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';import { join } from 'node:path';import { ROOT } from '../server/config.mjs';
const store=new Store();store.createSession('demo','csrf',{balanceMicros:10_000_000,providerEarnedMicros:0});
const engine=new Engine(store,{mode:'demo'});const records=[];
for(const scenario of ['success','failure','late','invalid']){
  const q=engine.quote('demo',{start:engine.slots()[0].start,quantity:3,query:'Solana USDC payments'});
  const r=await engine.reserve('demo',{quoteId:q.id});await engine.fund('demo',r.id);engine.openWindow('demo',r.id);await engine.execute('demo',r.id,{scenario});engine.verify('demo',r.id);records.push(await engine.finish('demo',r.id));
}
mkdirSync(join(ROOT,'qa'),{recursive:true});
writeFileSync(join(ROOT,'qa/demo-evidence.json'),JSON.stringify({schema:'commit.worldsfair.qa.v1',generatedAt:new Date().toISOString(),mode:'simulation',note:'Actual new-code executions over a fixed corpus. No blockchain transactions or external customer usage.',records,balance:engine.sessionData('demo')},null,2));
console.log(records.map(r=>({id:r.id,scenario:r.execution.scenario,status:r.status,providerPaid:r.settlement.providerMicros/1e6,refunded:r.settlement.refundMicros/1e6})));
store.close();
