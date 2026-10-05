import { writeKey, DEVNET_GENESIS } from '../server/solana.mjs';
import { Connection } from '@solana/web3.js';
import { config } from '../server/config.mjs';
const cfg=config();
const operator=writeKey(cfg.operatorFile),provider=writeKey(cfg.providerFile);
const connection=new Connection(cfg.rpc,'confirmed');
if(await connection.getGenesisHash()!==DEVNET_GENESIS)throw Error('Wrong cluster; stopped.');
console.log('Fresh isolated Devnet public addresses (private keys remain gitignored):');
console.log('Operator:',operator.publicKey.toBase58());console.log('Provider:',provider.publicKey.toBase58());
if(process.argv.includes('--airdrop')) {
  try {const signature=await connection.requestAirdrop(operator.publicKey,1_000_000_000);console.log('Devnet SOL airdrop:',signature);}catch{console.log('Public faucet rate-limited. Use https://faucet.solana.com for the operator address above.');}
}
console.log('Fund operator with Devnet SOL for payout fees. Fund your separate buyer wallet with Devnet SOL and Circle faucet USDC: https://faucet.circle.com/');
console.log('Then set COMMIT_WF_MODE=devnet and COMMIT_WF_STATE=.state/devnet.sqlite in the new repo .env.');
