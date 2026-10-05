import { build } from 'esbuild';
import { mkdirSync, copyFileSync, cpSync } from 'node:fs';
import { ROOT } from '../server/config.mjs';
process.chdir(ROOT);
mkdirSync('dist',{recursive:true});
await build({entryPoints:['web/app.mjs'],outfile:'dist/app.js',bundle:true,platform:'browser',target:['es2022'],minify:true});
copyFileSync('web/index.html','dist/index.html');copyFileSync('web/style.css','dist/style.css');cpSync('web/assets','dist/assets',{recursive:true});
console.log('Built independent Commit frontend.');
