import test from 'node:test';import assert from 'node:assert/strict';
import { config,insideState } from '../server/config.mjs';
test('old environment values do not affect this repo',()=>{const cfg=config({COMMIT_RPC_URL:'https://mainnet.example',COMMIT_API_PORT:'3000'});assert.equal(cfg.port,4317);assert.equal(cfg.mode,'demo');assert.match(cfg.db,/commit-worldsfair\/\.state\/demo.sqlite$/);});
test('mainnet mode, wrong mint and paths outside .state are rejected',()=>{assert.throws(()=>config({COMMIT_WF_MODE:'mainnet'}));assert.throws(()=>config({COMMIT_WF_USDC_MINT:'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'}));assert.throws(()=>insideState('../oldCommit/key.json'));assert.throws(()=>insideState('/Users/kin/.ssh/a'));});
test('RPC cannot point to an old deployment, custom domain or mainnet',()=>{assert.throws(()=>config({COMMIT_WF_RPC:'https://api.mainnet-beta.solana.com'}));assert.throws(()=>config({COMMIT_WF_RPC:'https://old-commit.example'}));});
