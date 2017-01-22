import { app, BrowserWindow, Menu, shell } from 'electron'
import { } from './providers/importProvider'
import { openImportWindow, openStatsWindow, openSummaryWindow, reload, toggleDevTools } from './windows'
import { isMac } from '../helpers/platform'
import t from '../helpers/i18n'

function application(): any {
  const name = 'Billy'

  return {
    label: name,
    submenu: [
      {
        label: `${t('Über')} ${name}`,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: `${name} ${t('verbergen')}`,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: t('Alle Fenster zeigen'),
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: t('Beenden'),
        accelerator: 'Command+Q',
        click: function () { app.quit(); }
      },
    ]
  }
}

function edit() {
  return {
    label: t('Bearbeiten'),
    submenu: [{
      label: t('Ausschneiden'),
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: t('Kopieren'),
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: t('Einfügen'),
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: t('Alles markieren'),
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }, {
      label: t('Importieren'),
      accelerator: 'CmdOrCtrl+I',
      click: () => openImportWindow()
    }]
  }
}

function view() {
  return {
    label: t('Ansicht'),
    submenu: [{
      label: t('Neu laden'),
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => reload(focusedWindow)
    }, {
      label: t('Entwicklertools'),
      accelerator: (() => {
        if (isMac()) {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: (item, focusedWindow) => toggleDevTools(focusedWindow)
    }, {
      label: t('Statistiken'),
      accelerator: 'CmdOrCtrl+T',
      click: () => openStatsWindow()
    }, {
      label: t('Übersicht'),
      accelerator: 'CmdOrCtrl+E',
      click: () => openSummaryWindow()
    }]
  }
}

function window() {
  return {
    label: t('Fenster'),
    role: 'window',
    submenu: [
      {
        label: t('Minimieren'),
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: t('Schließen'),
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  }
}

function help() {
  return {
    label: t('Hilfe'),
    role: 'help',
    submenu: [{
      label: t('Mehr erfahren'),
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