const messages = {
  'Rechnung': 'Rechnung',
  'Rechnung_plural': 'Rechnungen',
  'Rechnungsnr.': 'Rechnungsnr.',
  'Löschen erfolgreich': 'Die Rechnung wurde gelöscht!',
  'Löschen erfolgreich_plural': 'Die Rechnungen wurden gelöscht!',
  'Datenbank Fehler': 'Es ist ein Fehler aufgetreten: ',
  'Datenbank Fehler duplicate id': 'Es existiert bereits ein Datensatz mit dieser ID',
}

interface Options {
  count?: number;
}

export default function t(msgid, options: Options = {}) {
  if ('count' in options && options.count != 1) {
    msgid += '_plural'
  }

  return messages[msgid] || msgid
}
