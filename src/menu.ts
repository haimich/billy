function application() {
  return {
    label: 'foo',
    submenu: [{
      label: 'This is Billy ❤'
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

function view(electron) {
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
            electron.BrowserWindow.getAllWindows().forEach((win) => {
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

function help(electron) {
  return {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click: () => {
        electron.shell.openExternal('https://github.com/haimich/billy')
      }
    }]
  }
}

export function initMenu(electron) {
  return electron.Menu.buildFromTemplate([
    application(), edit(), view(electron), help(electron)
  ])
}