import { app, BrowserWindow, utilityProcess } from 'electron';
import type { UtilityProcess } from 'electron';
import path from 'node:path';

const HOST = '127.0.0.1';
const PORT = 5269;
const BASE_URL = `http://${HOST}:${PORT}/`;

// Dev: load the running Vite dev server. Set USE_BUILD=1 to test the built app without packaging.
const useBuild = app.isPackaged || process.env.USE_BUILD === '1';

// Packaged: resources/server. Unpackaged: <project>/build
const buildDir = app.isPackaged
  ? path.join(process.resourcesPath, 'server')
  : path.join(__dirname, '..', 'build');

let server: UtilityProcess | null = null;

function startServer() {
  server = utilityProcess.fork(path.join(buildDir, 'index.js'), [], {
    env: {
      ...process.env,
      HOST,
      PORT: String(PORT),
      ORIGIN: `http://${HOST}:${PORT}`, // needed for form actions / POST requests
    },
    stdio: 'inherit',
  });
}

async function waitForServer(url: string, tries = 50) {
  for (let i = 0; i < tries; i++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error('SvelteKit server did not start');
}

const createWindow = async () => {
  if (useBuild) {
    startServer();
    await waitForServer(BASE_URL);
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadURL(BASE_URL);
};

app.whenReady().then(createWindow);

app.on('before-quit', () => server?.kill());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});