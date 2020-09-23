const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;

app.on('ready', (_) => {
  new BrowserWindow();
  const appName = app.getName();

  globalShortcut.register('CmdOrCtrl+Q', () => app.quit());

  const template = [
    {
      label: appName,
      submenu: [
        {
          label: `About ${appName}`,
          click: (_) => {
            console.log('Clicked About!');
          },
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          click: (_) => {
            app.quit();
          },
        },
      ],
    },
  ];

  const appMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(appMenu);
});
