import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class AppComponent extends React.Component<any, {}> {

  handleOnClick() {

  }

  render() {
    return (
      <div>
        <h2>Welcome to Billy!</h2>
        <img src="../static/images/accountants.png"/>

      </div>
    )
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
