import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction, createTransferCheckedInstruction, getMint, TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, USDC, insideState } from './config.mjs';
import { AppError, requireThat } from './engine.mjs';
export const DEVNET_GENESIS='EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export const MEMO=new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
export const memoFor=r=>`commit-worldsfair:${r.id}:${r.termsHash}`;
export function base58(bytes) {
  const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let n=BigInt('0x'+Buffer.from(bytes).toString('hex')),str='';
  while(n){str=alphabet[Number(n%58n)]+str;n/=58n;}
  for(const b of bytes){if(b!==0)break;str='1'+str;}
  return str;
}
export function writeKey(path) {
  const safe=insideState(path);mkdirSync(resolve(ROOT,'.state'),{recursive:true,mode:0o700});
  if(existsSync(safe))return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(safe,'utf8'))));
  const key=Keypair.generate();writeFileSync(safe,JSON.stringify([...key.secretKey]),{mode:0o600,flag:'wx'});return key;
}
export class SolanaCustody {
  constructor(cfg) {
    this.cfg=cfg;this.connection=new Connection(cfg.rpc,{commitment:'confirmed',confirmTransactionInitialTimeout:30_000});this.mint=new PublicKey(USDC);
    this.operator=this.load(cfg.operatorFile);this.provider=this.load(cfg.providerFile);
    requireThat(this.operator.publicKey.toBase58()!==this.provider.publicKey.toBase58(),'Operator and provider must use different new test wallets.',503);
  }
  load(path) { requireThat(existsSync(path),'Fresh devnet keys missing. Run npm run devnet:setup.',503); return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(path,'utf8')))); }
  async check() {
    requireThat(await this.connection.getGenesisHash()===DEVNET_GENESIS,'Wrong cluster. Only Solana Devnet is allowed.',503);
    const mint=await getMint(this.connection,this.mint,'confirmed',TOKEN_PROGRAM_ID);
    requireThat(mint.decimals===6,'Unexpected USDC mint decimals.',503);
    return {cluster:'devnet',genesisHash:DEVNET_GENESIS,mint:USDC,decimals:6,operator:this.operator.publicKey.toBase58(),provider:this.provider.publicKey.toBase58(),operatorSol:(await this.connection.getBalance(this.operator.publicKey))/1e9,custody:'project-operated'};
  }
  validateBuyer(value) { try{return new PublicKey(value).toBase58();}catch{throw new AppError('Connect a Solana Devnet wallet.',400);} }
  vaultKey(id) {requireThat(/^r_[0-9a-f-]{36}$/.test(id),'Invalid reservation ID.',400);return insideState(`.state/vault-${id}.json`);}
  createVault(id) {return writeKey(this.vaultKey(id)).publicKey.toBase58();}
  async depositTransaction(r) {
    await this.check();
    const buyer=new PublicKey(r.buyer),vault=new PublicKey(r.vault);
    const from=getAssociatedTokenAddressSync(this.mint,buyer),to=getAssociatedTokenAddressSync(this.mint,vault);
    const {blockhash,lastValidBlockHeight}=await this.connection.getLatestBlockhash('confirmed');
    const tx=new Transaction({feePayer:buyer,blockhash,lastValidBlockHeight}).add(
      createAssociatedTokenAccountIdempotentInstruction(buyer,to,vault,this.mint),
      createTransferCheckedInstruction(from,this.mint,to,buyer,BigInt(r.terms.totalMicros),6),
      new TransactionInstruction({programId:MEMO,keys:[{pubkey:buyer,isSigner:true,isWritable:false}],data:Buffer.from(memoFor(r))})
    );
    return {transaction:tx.serialize({requireAllSignatures:false,verifySignatures:false}).toString('base64'),blockhash,lastValidBlockHeight,amountMicros:r.terms.totalMicros,mint:USDC,vault:r.vault,cluster:'devnet',termsHash:r.termsHash};
  }
  async verifyDeposit(r,signature) {
    await this.check();
    const tx=await this.connection.getParsedTransaction(signature,{commitment:'confirmed',maxSupportedTransactionVersion:0});
    requireThat(tx && tx.meta && !tx.meta.err,'Deposit is not confirmed or failed. Retry after confirmation.');
    const keys=tx.transaction.message.accountKeys;
    requireThat(keys.some(k=>k.pubkey.toBase58()===r.buyer&&k.signer),'Deposit was not signed by the reserved buyer.');
    const buyer=new PublicKey(r.buyer),vault=new PublicKey(r.vault);
    const from=getAssociatedTokenAddressSync(this.mint,buyer).toBase58(),to=getAssociatedTokenAddressSync(this.mint,vault).toBase58();
    const instructions=tx.transaction.message.instructions;
    const transfer=instructions.find(ix=>ix.programId.toBase58()===TOKEN_PROGRAM_ID.toBase58()&&ix.parsed?.type==='transferChecked'&&ix.parsed.info.source===from&&ix.parsed.info.destination===to&&ix.parsed.info.mint===USDC&&ix.parsed.info.authority===r.buyer&&ix.parsed.info.tokenAmount.amount===String(r.terms.totalMicros)&&ix.parsed.info.tokenAmount.decimals===6);
    requireThat(transfer,'Deposit must transfer the exact quoted Devnet USDC amount to this reservation vault.');
    requireThat(instructions.some(ix=>ix.programId.toBase58()===MEMO.toBase58()&&ix.parsed===memoFor(r)),'Missing reservation and terms memo.');
    const index=keys.findIndex(k=>k.pubkey.toBase58()===to);
    const before=tx.meta.preTokenBalances?.find(x=>x.accountIndex===index&&x.mint===USDC);
    const after=tx.meta.postTokenBalances?.find(x=>x.accountIndex===index&&x.mint===USDC&&x.owner===r.vault);
    requireThat(after && BigInt(after.uiTokenAmount.amount)-BigInt(before?.uiTokenAmount.amount||'0')===BigInt(r.terms.totalMicros),'Vault net balance did not increase by the quote amount.');
    return {kind:'solana-devnet',signature,slot:tx.slot,amountMicros:r.terms.totalMicros,mint:USDC,vault:r.vault,explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`};
  }
  async payout(r,passed,store) {
    await this.check();
    const id=`payout:${r.id}`,recipient=passed?this.provider.publicKey:new PublicKey(r.buyer);
    let job=store.get('outbox',id);
    if(!job) {
      const vault=this.load(this.vaultKey(r.id)),from=getAssociatedTokenAddressSync(this.mint,vault.publicKey),to=getAssociatedTokenAddressSync(this.mint,recipient);
      const balance=await getAccount(this.connection,from,'confirmed');
      requireThat(balance.amount>=BigInt(r.terms.totalMicros),'Vault has insufficient tokens. Settlement paused.');
      const {blockhash,lastValidBlockHeight}=await this.connection.getLatestBlockhash('confirmed');
      const tx=new Transaction({feePayer:this.operator.publicKey,blockhash,lastValidBlockHeight}).add(
        createAssociatedTokenAccountIdempotentInstruction(this.operator.publicKey,to,recipient,this.mint),
        createTransferCheckedInstruction(from,this.mint,to,vault.publicKey,BigInt(r.terms.totalMicros),6),
        new TransactionInstruction({programId:MEMO,keys:[],data:Buffer.from(`${passed?'settle':'refund'}:${memoFor(r)}:${r.verification.proofHash}`)})
      );
      tx.sign(this.operator,vault);
      job={signature:base58(tx.signature),raw:tx.serialize().toString('base64'),lastValidBlockHeight,blockhash,recipient:recipient.toBase58(),passed};
      // Persist signed transaction before broadcast. Retries reuse the same signature.
      store.put('outbox',id,job);
    }
    requireThat(job.passed===passed,'Settlement decision changed. Manual reconciliation required.');
    let status=(await this.connection.getSignatureStatuses([job.signature],{searchTransactionHistory:true})).value[0];
    if(!status) {
      requireThat(await this.connection.getBlockHeight('confirmed')<=job.lastValidBlockHeight,'Payout transaction expired with unknown outcome. Reconcile its signature; do not create a new payment automatically.',503);
      await this.connection.sendRawTransaction(Buffer.from(job.raw,'base64'),{skipPreflight:false,maxRetries:3});
      const confirmation=await this.connection.confirmTransaction({signature:job.signature,blockhash:job.blockhash,lastValidBlockHeight:job.lastValidBlockHeight},'confirmed');
      requireThat(!confirmation.value.err,'Payout transaction failed. Funds remain in the vault.',503);
    } else {requireThat(!status.err,'Payout transaction failed. Manual reconciliation required.',503);requireThat(['confirmed','finalized'].includes(status.confirmationStatus),'Payout is still confirming. Retry shortly.',503);}
    return {kind:'solana-devnet',signature:job.signature,amountMicros:r.terms.totalMicros,recipient:job.recipient,mint:USDC,explorer:`https://explorer.solana.com/tx/${job.signature}?cluster=devnet`};
  }
}
