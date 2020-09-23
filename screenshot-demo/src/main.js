const electron = require('electron');

const { app, BrowserWindow, globalShortcut, ipcMain: ipc } = electron;

let mainWindow;

app.on('ready', (_) => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    resizable: false,
    frame: true,
  });

  mainWindow.loadURL(`file://${__dirname}/capture.html`);

  mainWindow.on('close', (_) => {
    mainWindow = null;
  });

  globalShortcut.register(`Alt+Ctrl+D`, (_) => {
    console.log('Capturing...');
    mainWindow.webContents.send('capture', app.getPath('pictures'));
  });
});

ipc.on('screenshot-captured', (_) => {
  console.log('Screenshot is captured!');
});

ipc.on('error', (_) => {
  console.log('Error in capturing screenshot!');
});
