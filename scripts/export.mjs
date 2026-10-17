import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url),out=path.resolve(process.argv[2]||'downloads');await fs.mkdir(out,{recursive:true});
let html=await fs.readFile(new URL('index.html',root),'utf8');const css=await fs.readFile(new URL('src/style.css',root),'utf8');
const modules=await Promise.all(['engine','campaign','atmosphere','soundtrack'].map(name=>fs.readFile(new URL(`src/${name}.js`,root),'utf8')));
const extras=modules.map(s=>s.replace(/^import .*;\n/gm,'').replace(/^export /gm,'')).join('\n');
let app=await fs.readFile(new URL('src/app.js',root),'utf8');const levels=await fs.readFile(new URL('src/levels.json',root),'utf8');
app=app.replace(/^import .*;\n/gm,'').replace(/^const levels = await fetch.*;$/m,()=>`const levels = ${levels.trim()};`).replace(/^if\('serviceWorker'.*;$/m,'');
html=html.replace(/<link rel="(?:icon|manifest)"[^>]*>/g,'').replace('<link rel="stylesheet" href="./src/style.css">',()=>`<style>${css}</style>`).replace('<script type="module" src="./src/app.js"></script>',()=>`<script>\n(()=>{'use strict';\n${extras}\n${app}\n})();\n</script>`);
if(html.includes('import.meta'))throw Error('Standalone still contains module metadata');
await fs.writeFile(path.join(out,'NEXO-preview-v10.html'),html);
const result=spawnSync('python3',['-c',String.raw`
import pathlib,zipfile,sys
out=pathlib.Path(sys.argv[1]);root=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(out/'NEXO-PC-v10.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(out/'NEXO-preview-v10.html','NEXO/index.html')
 z.writestr('NEXO/LEEME.txt','NEXO — Extrae el ZIP y abre NEXO/index.html. No requiere servidor ni conexión.\n250 retos en 51 fases; Aventura y Juego libre independientes, guías, límite, deshacer y pistas.\nTres atmósferas y música original sintetizada.\nEl progreso se guarda en este navegador. Ajustes > Mis datos permite descargar y restaurar una copia.\n')
with zipfile.ZipFile(out/'NEXO-web-v10.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in (root/'dist').rglob('*'):
  if f.is_file():z.write(f,f.relative_to(root/'dist'))
`,out,fileURLToPath(root)],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);console.log('Exported standalone preview, PC ZIP and hosting ZIP:',out);
