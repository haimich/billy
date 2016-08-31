import * as React from 'react';
import * as ReactDOM from 'react-dom';
import t from '../common/helpers/i18n'

export default class AppComponent extends React.Component<any, {}> {

  refs: {
    file: HTMLInputElement
  }

  handleOnClick() {

  }

  onFileinputChange(event) {
    // this.setState({ file: this.getFile(event.target.files) })
    console.log('event')
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
                  <small ref="fileLabel">dateiname</small>
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
