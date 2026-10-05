import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
// Small project-operated retrieval provider. Actual output is computed, not a prerecorded run.
// Summaries are project-authored paraphrases; no claim of live web search or AI inference.
export const CORPUS = [
  { id: 'solana', title: 'Solana token transfers', url: 'https://solana.com/docs/tokens/basics/transfer-tokens', keywords: 'solana token transfer usdc escrow payments', summary: 'SPL tokens move between accounts for the same mint. TransferChecked checks the mint and its decimal precision.' },
  { id: 'circle', title: 'Circle USDC addresses', url: 'https://developers.circle.com/stablecoins/usdc-contract-addresses', keywords: 'circle usdc solana mint devnet payment stablecoin', summary: 'Circle lists a separate Solana Devnet USDC mint. Devnet tokens are used for testing and have no financial value.' },
  { id: 'colosseum', title: 'Colosseum founder competition', url: 'https://colosseum.com/hackathon', keywords: 'colosseum founder startup judging market hackathon', summary: 'The submission includes product execution, founder context, demand validation and a plan for distribution. Past development must be disclosed.' },
];
export const digest = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function executeProvider({ query, quantity, scenario, latencyLimitMs }) {
  const started = performance.now();
  await sleep(scenario === 'late' ? latencyLimitMs + 30 : 90);
  if (scenario === 'failure') throw Error('Controlled provider failure');
  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  const units = Array.from({length: quantity}, (_,i) => {
    const scored = CORPUS.map(doc => ({ doc, score: words.filter(w => `${doc.keywords} ${doc.title}`.toLowerCase().includes(w)).length })).sort((a,b) => b.score - a.score);
    const citations = scored.filter(x => x.score > 0).map(x => ({...x.doc}));
    return { unit: i+1, query, answer: citations.map(c => c.summary).join(' '), citations: citations.map(({id,title,url}) => ({id,title,url})) };
  });
  if (scenario === 'invalid') units[0].citations = [];
  return { units, observedLatencyMs: Math.ceil(performance.now() - started), provider: 'Commit ResearchNode / project-operated', corpusVersion: '2026-10-04', outputHash: digest(units), scenario };
}
export function verifyOutput(output, terms) {
  const checks = [
    { name: 'Reserved quantity delivered', pass: output.units.length === terms.quantity },
    { name: 'Observed response within SLA', pass: !output.error && output.observedLatencyMs <= terms.latencyLimitMs },
    { name: 'Every unit has content and a source', pass: output.units.length > 0 && output.units.every(u => typeof u.answer === 'string' && u.answer.length > 20 && u.citations.length >= terms.minCitations) },
    { name: 'Sources match the declared corpus', pass: output.units.length > 0 && output.units.every(u => u.citations.every(c => CORPUS.some(d => d.id === c.id && d.url === c.url))) },
    { name: 'Output integrity', pass: output.outputHash === digest(output.units) },
  ];
  return { passed: checks.every(c=>c.pass), checks, verifier: 'Commit-operated schema + latency verifier', proofHash: digest({ outputHash: output.outputHash, checks, termsHash: digest(terms) }), limitation: 'Verifies delivery shape and observed latency; does not prove semantic truth or independent resource availability.' };
}
