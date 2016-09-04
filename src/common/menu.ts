import { app, BrowserWindow, Menu, shell } from 'electron'
import { } from './providers/importProvider'
import { openImportWindow, reload, toggleDevTools } from './windows'
import { isMac } from './helpers/platform'

function application(): any {
  const name = 'Billy'

  return {
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () { app.quit(); }
      },
    ]
  }
}

function edit() {
  return {
    label: 'Edit',
    submenu: [{
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }, {
      label: 'Import',
      accelerator: 'CmdOrCtrl+I',
      click: () => openImportWindow()
    }]
  }
}

function view() {
  return {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => reload(focusedWindow)
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (() => {
        if (isMac()) {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: (item, focusedWindow) => toggleDevTools(focusedWindow)
    }]
  }
}

function window() {
  return {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  }
}

function help() {
  return {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click: () => shell.openExternal('https://github.com/haimich/billy')
    }]
  }
}

export function initMenu() {
  const template = Menu.buildFromTemplate([
    application(), edit(), view(), window(), help()
  ])
  Menu.setApplicationMenu(template)
}