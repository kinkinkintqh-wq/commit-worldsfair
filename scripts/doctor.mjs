import { config, ROOT } from '../server/config.mjs';
import { SolanaCustody } from '../server/solana.mjs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
const cfg=config();
console.log(JSON.stringify({app:'commit-worldsfair',node:process.versions.node,mode:cfg.mode,root:ROOT,built:existsSync(join(ROOT,'dist/index.html')),oldCommitEnvIgnored:true},null,2));
if(cfg.mode==='devnet')console.log(JSON.stringify(await new SolanaCustody(cfg).check(),null,2));
