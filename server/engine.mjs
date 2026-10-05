import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { digest, executeProvider, verifyOutput } from './provider.mjs';
export class AppError extends Error { constructor(message, status = 409) { super(message); this.status = status; } }
export const requireThat = (condition, message, status) => { if (!condition) throw new AppError(message, status); };
export class Engine {
  constructor(store, cfg, chain = null, clock = () => Date.now(), provider = executeProvider) { Object.assign(this, {store, cfg, chain, clock, provider}); this.locks = new Set(); }
  sessionData(session) { const row = this.store.session(session); requireThat(row, 'Session expired. Refresh this page.', 401); return JSON.parse(row.data); }
  event(r, type, detail = {}) {
    const entry = { sequence: r.events.length + 1, type, at: new Date(this.now(r)).toISOString(), recordedAt: new Date(this.clock()).toISOString(), detail, previousHash: r.events.at(-1)?.hash || '0'.repeat(64) };
    entry.hash = digest(entry); r.events.push(entry); r.updatedAt = this.clock();
  }
  now(r) { return r.mode === 'demo' && r.demoClock ? Math.max(this.clock(), r.demoClock) : this.clock(); }
  save(r) { this.store.put('reservations', r.id, r, r.session); return r; }
  get(session, id) { const r = this.store.get('reservations', id); requireThat(r && r.session === session && r.mode === this.cfg.mode, 'Reservation not found.', 404); return r; }
  public(r) { const { session, ...rest } = r; return rest; }
  availability(start, end) {
    return Math.max(0, 32 - this.store.allReservations().filter(r => r.mode === this.cfg.mode && !['settled','refunded'].includes(r.status) && r.terms.start < end && r.terms.end > start).reduce((n,r)=>n+r.terms.quantity,0));
  }
  slots() {
    const earliest = this.clock() + (this.cfg.mode === 'devnet' ? 90_000 : 20_000);
    const first = Math.ceil(earliest / 60_000) * 60_000;
    return [0,1,2].map(i => { const start = first + i*15*60_000, end=start+10*60_000; return {start,end,capacity:32,available:this.availability(start,end)}; });
  }
  quote(session, { start, quantity, query }) {
    requireThat(Number.isInteger(quantity) && quantity >= 1 && quantity <= 20, 'Choose between 1 and 20 retrieval units.',400);
    requireThat(typeof query === 'string' && query.trim().length >= 3 && query.length <= 240, 'A query of 3–240 characters is required.',400);
    const slot = this.slots().find(s=>s.start===start);
    requireThat(slot, 'Select a current future window.',400);
    requireThat(slot.available >= quantity, 'This window has insufficient capacity. Choose another window.');
    const terms = { service:'search.v1', query:query.trim(), quantity, start:slot.start, end:slot.end, unitPriceMicros:50_000, totalMicros:quantity*50_000, currency:this.cfg.mode==='devnet'?'USDC (Devnet)':'simulated USD', latencyLimitMs:1500, minCitations:1, provider:'Commit ResearchNode', verifier:'Commit-operated', refundPolicy:'Full refund if delivery fails SLA; unpaid holds do not count as paid orders.', custody:'Project-operated custody; no deployed custom escrow program' };
    const q={ id:`q_${randomUUID()}`,session,mode:this.cfg.mode,terms,termsHash:digest(terms),expiresAt:Math.min(this.clock()+90_000,slot.start),available:slot.available,consumed:false };
    this.store.put('quotes',q.id,q,session); return {...q,session:undefined};
  }
  async reserve(session, { quoteId, buyer }) {
    let wallet = buyer;
    if (this.cfg.mode === 'devnet') { requireThat(this.chain, 'Devnet is not configured.',503); wallet=this.chain.validateBuyer(buyer); }
    return this.store.tx(()=>{
      const q=this.store.get('quotes',quoteId);
      requireThat(q && q.session===session && q.mode===this.cfg.mode,'Quote not found.',404);
      if (q.consumed) { const old=this.store.allReservations().find(r=>r.quoteId===q.id); return this.public(old); }
      requireThat(this.clock()<q.expiresAt,'Quote expired. Get a fresh quote.');
      requireThat(this.availability(q.terms.start,q.terms.end)>=q.terms.quantity,'Capacity was reserved by another buyer. Quote again.');
      requireThat(this.store.allReservations().filter(r=>r.session===session&&!['settled','refunded'].includes(r.status)).length<3,'Finish or refund an existing reservation first.');
      const r={id:`r_${randomUUID()}`,quoteId:q.id,session,mode:this.cfg.mode,buyer:wallet||'demo-buyer',terms:q.terms,termsHash:q.termsHash,status:'reserved',createdAt:this.clock(),events:[],payment:null,execution:null,verification:null,settlement:null};
      if (this.chain) r.vault=this.chain.createVault(r.id);
      this.event(r,'quote',{quoteId:q.id,termsHash:q.termsHash,expiresAt:q.expiresAt});
      this.event(r,'reserve',{quantity:r.terms.quantity,windowStart:r.terms.start,termsHash:r.termsHash});
      q.consumed=true; this.store.put('quotes',q.id,q,session); this.save(r); return this.public(r);
    });
  }
  async locked(session,id,fn) {
    requireThat(!this.locks.has(id),'This reservation has an action in progress. Retry shortly.');
    this.locks.add(id); try { return await fn(this.get(session,id)); } finally { this.locks.delete(id); }
  }
  async fund(session,id,{signature}={}) {
    return this.locked(session,id,async r=>{
      if(r.payment) return this.public(r);
      requireThat(r.status==='reserved','Reservation cannot be funded in this state.');
      let receipt;
      if(this.cfg.mode==='devnet') {
        requireThat(typeof signature==='string'&&signature.length>=80&&signature.length<=100,'A valid deposit transaction signature is required.',400);
        requireThat(!this.store.signatureUsed(signature),'This deposit has already been used.');
        receipt=await this.chain.verifyDeposit(r,signature);
      } else {
        const data=this.sessionData(session);
        requireThat(data.balanceMicros>=r.terms.totalMicros,'Demo balance is insufficient.');
        receipt={kind:'simulation',amountMicros:r.terms.totalMicros,signature:null};
      }
      this.store.tx(()=>{
        if(this.cfg.mode==='demo') { const data=this.sessionData(session); data.balanceMicros-=r.terms.totalMicros; this.store.saveSession(session,data); }
        else this.store.recordSignature(signature,id);
        r.payment=receipt;r.status='escrowed';this.event(r,'escrow',receipt);this.save(r);
      });
      return this.public(r);
    });
  }
  openWindow(session,id) {
    const r=this.get(session,id);requireThat(this.cfg.mode==='demo','Devnet uses real time; the booked window cannot be fast-forwarded.',403);
    requireThat(r.status==='escrowed','Fund the reservation first.');
    r.demoClock=r.terms.start;this.event(r,'demo_clock_advanced',{note:'Demo clock only; no chain or wall clock was changed.'});return this.public(this.save(r));
  }
  async execute(session,id,{scenario='success'}={}) {
    return this.locked(session,id,async r=>{
      if(r.execution) return this.public(r);
      requireThat(r.status==='escrowed','Execution requires funded escrow.');
      requireThat(this.now(r)>=r.terms.start&&this.now(r)<r.terms.end,'Execute inside the booked time window.');
      requireThat(['success','failure','late','invalid'].includes(scenario),'Unknown scenario.',400);
      requireThat(r.mode==='demo'||scenario==='success','Fault injection is available only in the simulation demo.',403);
      r.executionStartedAt=this.now(r);r.status='executing';this.event(r,'execute_started',{scenario});this.save(r);
      const attemptStart=performance.now();
      try { r.execution=await this.provider({...r.terms,scenario}); }
      catch(e) { r.execution={units:[],observedLatencyMs:Math.ceil(performance.now()-attemptStart),provider:'Commit ResearchNode',outputHash:digest([]),error:e.message,scenario}; }
      // Outputs are not paid until the separate Verify step succeeds.
      r.executionCompletedAt=Math.max(this.now(r),r.executionStartedAt+r.execution.observedLatencyMs);
      r.status='executed';this.event(r,'execute_completed',{outputHash:r.execution.outputHash,observedLatencyMs:r.execution.observedLatencyMs,error:r.execution.error||null});this.save(r);return this.public(r);
    });
  }
  verify(session,id) {
    const r=this.get(session,id);requireThat(!this.locks.has(id),'Action in progress.');
    if(r.verification)return this.public(r);
    requireThat(r.status==='executed','Run the provider before verification.');
    r.verification=verifyOutput(r.execution,r.terms);
    r.verification.checks.push({name:'Delivery completed inside the booked window',pass:r.executionCompletedAt<=r.terms.end});
    r.verification.passed=r.verification.checks.every(c=>c.pass);
    r.verification.proofHash=digest({outputHash:r.execution.outputHash,checks:r.verification.checks,termsHash:r.termsHash});
    r.status=r.verification.passed?'verified':'failed';
    this.event(r,'verify',r.verification);return this.public(this.save(r));
  }
  async finish(session,id) {
    return this.locked(session,id,async r=>{
      if(['settled','refunded'].includes(r.status))return this.public(r);
      requireThat(r.payment,'There are no funded assets to settle or refund.');
      if(r.status==='escrowed') {
        requireThat(this.now(r)>=r.terms.end,'A no-show refund is available after the booked window ends.');
        r.verification={passed:false,checks:[{name:'Provider executed inside window',pass:false}],verifier:'Commit-operated',proofHash:digest({id:r.id,noShow:true}),limitation:'No-show refund after window end.'};r.status='failed';this.event(r,'verify_no_show',r.verification);this.save(r);
      }
      requireThat(['verified','failed','settling','refunding'].includes(r.status),'Verify the output before settlement.');
      const passed=r.verification.passed;
      r.status=passed?'settling':'refunding';this.save(r);
      let receipt;
      if(this.chain) receipt=await this.chain.payout(r,passed,this.store);
      else {
        receipt={kind:'simulation',signature:null,amountMicros:r.terms.totalMicros,recipient:passed?'demo-provider':'demo-buyer'};
      }
      r.settlement={...receipt,providerMicros:passed?r.terms.totalMicros:0,refundMicros:passed?0:r.terms.totalMicros,escrowRemainingMicros:0,proofHash:r.verification.proofHash};
      this.store.tx(()=>{
        if(!this.chain){const data=this.sessionData(session);if(passed)data.providerEarnedMicros+=r.terms.totalMicros;else data.balanceMicros+=r.terms.totalMicros;this.store.saveSession(session,data);}
        r.status=passed?'settled':'refunded';this.event(r,passed?'settle':'refund',r.settlement);this.save(r);
      });return this.public(r);
    });
  }
  recover() {
    for(const r of this.store.allReservations())if(r.mode===this.cfg.mode&&r.status==='executing') {
      r.execution={units:[],observedLatencyMs:0,outputHash:digest([]),error:'Execution interrupted by process restart.'};r.status='executed';this.event(r,'execution_interrupted');this.save(r);
    }
  }
}
