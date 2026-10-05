import test from 'node:test';import assert from 'node:assert/strict';
import { start } from '../server/index.mjs';import { config } from '../server/config.mjs';import { Store } from '../server/store.mjs';
test('HTTP sessions, CSRF, state-file isolation and full application flow',async()=>{
 const store=new Store(),cfg={...config(),port:0};const app=await start(cfg,{store});const origin=`http://127.0.0.1:${app.server.address().port}`;cfg.origin=origin;
 try{
  const initial=await fetch(`${origin}/api/state`),cookie=initial.headers.get('set-cookie').split(';')[0],state=await initial.json();
  const request=async(path,body,headers={})=>{const res=await fetch(`${origin}/api/${path}`,{method:'POST',headers:{'content-type':'application/json','cookie':cookie,origin,'x-csrf-token':state.csrf,...headers},body:JSON.stringify(body)});return {status:res.status,data:await res.json()};};
  assert.equal((await fetch(`${origin}/.state/operator.json`)).status,404);
  assert.equal((await request('quote',{}, {'x-csrf-token':'wrong'})).status,403);
  assert.equal((await request('quote',{}, {origin:'https://evil.example'})).status,403);
  const q=await request('quote',{start:state.slots[0].start,quantity:3,query:'Solana USDC'});assert.equal(q.status,200);
  const reserved=await request('reserve',{quoteId:q.data.id});assert.equal(reserved.status,200);const id=reserved.data.id;
  assert.equal((await request(`reservations/${id}/fund`,{})).data.status,'escrowed');
  await request(`reservations/${id}/open-window`,{});await request(`reservations/${id}/execute`,{scenario:'success'});await request(`reservations/${id}/verify`,{});
  assert.equal((await request(`reservations/${id}/finish`,{})).data.status,'settled');
  const other=await fetch(`${origin}/api/state`),otherCookie=other.headers.get('set-cookie').split(';')[0];
  assert.equal((await fetch(`${origin}/api/reservations/${id}/evidence`,{headers:{cookie:otherCookie}})).status,404);
 }finally{await new Promise(resolve=>app.server.close(resolve));store.close();}
});
