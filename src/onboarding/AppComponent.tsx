import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'

export default class AppComponent extends React.Component<any, {}> {

  refs: {
    file: HTMLInputElement
  }

  state: {
    folder?: File
  }

  constructor(props) {
    super(props)

    this.state = {
      folder: undefined
    }
  }

  onFileinputChange(event) {
    const files = event.target.files
    if (files.length >= 1) {
      this.setState({ folder: files[0] })
      console.log(files[0])
    }
  }

  render() {
    return (
      <div>
        <h2>{t('Willkommen bei Billy!')}</h2>
        <img src="../static/images/accountants.png"/>

        <div id="form-container">
          <form className="form-horizontal container">

            <div className="row">
              <b>{t('Wo soll ich Deine Rechnungen ablegen?')}</b>
              <p></p>
            </div>

            <div className="row">
              <div className="form-group">
                <div className="col-sm-offset-4 col-sm-12">
                  <label className="btn btn-default btn-sm">
                    {t('Ordner auswählen')}
                    <input type="file" className="form-control hidden" id="file" ref="file" onChange={this.onFileinputChange.bind(this)} />
                  </label> &nbsp;
                  <small ref="fileLabel">{this.state.folder && this.state.folder.path}</small>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  componentDidMount() {
    // set file input attributes so it only selects folders
    this.refs.file.setAttribute('directory', '')
    this.refs.file.setAttribute('webkitdirectory', '')
  }
}

  // settings.defaults({
  //   knex: {
  //     client: 'sqlite3',
  //     migrations: {
  //       tableName: 'migrations',
  //       directory: './sql/migrations'
  //     },
  //     seeds: {
  //       directory: './sql/seeds'
  //     },
  //     useNullAsDefault: true // see http://knexjs.org/#Builder-insert
  //   }
  // })
  // if (isDev) {
  //   await set('knex.connection.filename', './bills.sqlite')
  // }
