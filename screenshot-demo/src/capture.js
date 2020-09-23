const electron = require('electron');
const path = require('path');
const fs = require('fs');

const { desktopCapturer, ipcRenderer: ipc, screen } = electron;

function getMainSource(desktopCapturer, screen, done) {
  const options = { types: ['screen'], thumbnailSize: screen.getPrimaryDisplay().workAreaSize };
  desktopCapturer.getSources(options, (error, sources) => {
    if (error) {
      return console.log('Cannot capture screen:', error);
    }

    const isMainSource = (source) => source.name === 'Entire screen' || source.name === 'Screen 1';
    done(sources.filter(isMainSource)[0]);
  });
}

function onCapture(event, targetDir) {
  getMainSource(desktopCapturer, screen, (source) => {
    const png = source.thumbnail.toPng();
    const filePath = path.join(targetDir, 'screenshot_' + new Date().toISOString() + '.png');
    writeScreenshot(png, filePath);
  });
}

function writeScreenshot(png, filePath) {
  fs.writeFileSync(filePath, png, (error) => {
    if (error) {
      ipc.send('error');
      return console.log('Failed to write screenshot:', error);
    }

    ipc.send('screenshot-captured');
  });
}

ipc.on('capture', onCapture);
