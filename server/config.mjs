import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';
export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const USDC = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
export function insideState(path) {
  const p = resolve(ROOT, path);
  const rel = relative(resolve(ROOT, '.state'), p);
  if (rel.startsWith('..') || rel === '' || rel.startsWith('/')) throw Error('State and key files must be inside this new repo’s .state directory.');
  return p;
}
export function config(env = process.env) {
  const mode = env.COMMIT_WF_MODE || 'demo';
  if (!['demo', 'devnet'].includes(mode)) throw Error('Only demo or devnet is allowed.');
  const rpc = env.COMMIT_WF_RPC || 'https://api.devnet.solana.com';
  if (rpc !== 'https://api.devnet.solana.com') throw Error('This prototype allows only the official public Solana Devnet RPC.');
  if ((env.COMMIT_WF_USDC_MINT || USDC) !== USDC) throw Error('Only official Circle Devnet USDC is allowed.');
  const port = Number(env.COMMIT_WF_PORT || 4317);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid port.');
  return {
    mode, rpc, mint: USDC, port, host: env.COMMIT_WF_HOST || '127.0.0.1',
    origin: env.COMMIT_WF_ORIGIN || `http://127.0.0.1:${port}`,
    db: insideState(env.COMMIT_WF_STATE || `.state/${mode}.sqlite`),
    operatorFile: insideState(env.COMMIT_WF_OPERATOR_FILE || '.state/operator.json'),
    providerFile: insideState(env.COMMIT_WF_PROVIDER_FILE || '.state/provider.json'),
  };
}
