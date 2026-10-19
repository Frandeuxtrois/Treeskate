// Saca capturas de las páginas principales con Edge/Chrome headless.
// Uso: npm run build && npm run capturas            -> todas las rutas
//      npm run capturas -- /tienda /producto/x      -> solo esas rutas
// Salida: capturas/<ruta>-desktop.png y capturas/<ruta>-mobile.png
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'capturas');
const PUERTO = 4317;
const BASE = `http://localhost:${PUERTO}`;

const NAVEGADORES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const navegador = NAVEGADORES.find((p) => existsSync(p));
if (!navegador) throw new Error('No encontré Edge ni Chrome para sacar capturas.');
if (!existsSync(join(RAIZ, 'dist'))) throw new Error('Falta dist/. Corré `npm run build` primero.');

const pedidas = process.argv.slice(2).filter((a) => a.startsWith('/'));
const RUTAS = pedidas.length
  ? pedidas
  : ['/', '/tienda', '/tienda/zapatillas', '/producto/tabla-maple-lab-canadian', '/checkout', '/nosotros', '/ayuda'];

const VIEWPORTS = [
  { nombre: 'desktop', ancho: 1440, alto: 2600 },
  // El modo headless no achica la ventana por debajo de ~500px: el mobile se renderiza dentro de un iframe de 390px.
  { nombre: 'mobile', ancho: 390, alto: 3000 },
];

mkdirSync(SALIDA, { recursive: true });
const perfil = join(tmpdir(), `tree-capturas-${Date.now()}`);

const servidor = spawn(`npx vite preview --port ${PUERTO} --strictPort`, { cwd: RAIZ, shell: true, stdio: 'ignore' });

const esperarServidor = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {
      // todavía levantando
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('vite preview no levantó en 30s');
};

let n = 0;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
// En Windows msedge.exe devuelve el control antes de escribir el PNG: hay que esperar el archivo.
const capturar = async (url, archivo, ancho, alto) => {
  for (let intento = 1; intento <= 3; intento++) {
    rmSync(archivo, { force: true });
    try {
      execFileSync(navegador, [
        '--headless', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000', '--no-first-run',
        `--user-data-dir=${perfil}-${n++}`, `--window-size=${ancho},${alto}`, `--screenshot=${archivo}`, url,
      ], { stdio: 'ignore', timeout: 120000 });
    } catch {
      // Edge a veces sale con código != 0 aunque haya guardado la imagen
    }
    for (let i = 0; i < 60; i++) {
      if (existsSync(archivo) && statSync(archivo).size > 0) {
        await dormir(300);
        return;
      }
      await dormir(500);
    }
  }
  throw new Error(`No se pudo capturar ${url}`);
};

try {
  await esperarServidor();
  for (const ruta of RUTAS) {
    const nombre = ruta === '/' ? 'inicio' : ruta.slice(1).replace(/\//g, '_');
    for (const vp of VIEWPORTS) {
      const archivo = join(SALIDA, `${nombre}-${vp.nombre}.png`);
      if (vp.nombre === 'mobile') {
        // el marco se sirve desde dist/ para que el iframe sea del mismo origen
        writeFileSync(join(RAIZ, 'dist', '_marco.html'), `<!doctype html><body style="margin:0"><iframe src="${ruta}" style="width:${vp.ancho}px;height:${vp.alto}px;border:0;display:block"></iframe>`);
        await capturar(`${BASE}/_marco.html`, archivo, 600, vp.alto);
      } else {
        await capturar(`${BASE}${ruta}`, archivo, vp.ancho, vp.alto);
      }
      console.log(`✓ ${archivo}`);
    }
  }
  console.log('Nota: las capturas mobile miden 600px de ancho; la página ocupa los primeros 390px.');
} finally {
  rmSync(join(RAIZ, 'dist', '_marco.html'), { force: true });
  servidor.kill();
  if (process.platform === 'win32') {
    try {
      execFileSync('cmd', ['/c', `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PUERTO} ^| findstr LISTENING') do taskkill /F /PID %a`], { stdio: 'ignore' });
    } catch {
      // ya estaba cerrado
    }
  }
}
