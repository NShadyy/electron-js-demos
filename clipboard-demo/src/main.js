const electron = require('electron');
const path = require('path');

const { app, clipboard, globalShortcut, Tray, Menu } = electron;

const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 20;

function formatItem(item) {
  return item && item.length > ITEM_MAX_LENGTH ? item.substr(0, ITEM_MAX_LENGTH) + '...' : item;
}

function formatMenuTemplateForStack(clipboard, stack) {
  return stack.map((item, i) => {
    return {
      label: `Copy: ${formatItem(item)}`,
      click: (_) => clipboard.writeText(item),
      accelerator: `CmdOrCtrl+Alt+${i + 1}`,
    };
  });
}

function addToStack(item, stack) {
  return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack);
}

function checkClipboardForChange(clipboard, onChange) {
  let cache = clipboard.readText();
  let latest;

  setInterval((_) => {
    latest = clipboard.readText();

    if (latest !== cache) {
      cache = latest;
      onChange(cache);
    }
  }, 1000);
}

function registerShortcuts(globalShortcut, clipboard, stack) {
  globalShortcut.unregisterAll();
  for (let i = 0; i < STACK_SIZE; i++) {
    globalShortcut.register(`CmdOrCtrl+Alt+${i + 1}`, (_) => {
      clipboard.writeText(stack[i]);
    });
  }
}

app.on('ready', (_) => {
  let stack = [];
  const tray = new Tray(path.join('assets', 'icon.png'));
  const template = [
    {
      label: '<Empty>',
      enabled: false,
    },
  ];
  const contextMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenu);

  checkClipboardForChange(clipboard, (text) => {
    console.log('clipboard text changed to =>', text);

    stack = addToStack(text, stack);
    const templateForStack = formatMenuTemplateForStack(clipboard, stack);
    const formattedContextMenu = Menu.buildFromTemplate(templateForStack);
    tray.setContextMenu(formattedContextMenu);

    registerShortcuts(globalShortcut, clipboard, stack);
  });
});

app.on('will-quit', (_) => {
  globalShortcut.unregisterAll();
});
