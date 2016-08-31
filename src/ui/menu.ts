import { app, BrowserWindow, Menu, shell } from 'electron'

function application() {
  return {
    label: 'foo',
    submenu: [{
      label: 'This is Billy ❤'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
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
    }]
  }
}

function view() {
  return {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          // on reload, start fresh and close any old
          // open secondary windows
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach((win) => {
              if (win.id > 1) {
                win.close()
              }
            })
          }
          focusedWindow.reload()
        }
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  }
}

function help() {
  return {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click: () => {
        shell.openExternal('https://github.com/haimich/billy')
      }
    }]
  }
}

export function initMenu() {
  const template = Menu.buildFromTemplate([
    application(), edit(), view(), help()
  ])
  Menu.setApplicationMenu(template)
}