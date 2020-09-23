const electron = require('electron');
const path = require('path');

const { app, Tray, Menu } = electron;

app.on('ready', (_) => {
  const tray = new Tray(path.join('assets', 'icon.png'));

  const template = [
    {
      label: 'Wow',
      click: (_) => {
        console.log('Wow');
      },
    },
    {
      label: 'Awesome',
      click: (_) => {
        console.log('Awesome');
      },
    },
  ];

  const contextMenu = Menu.buildFromTemplate(template);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('My Great App');
});
