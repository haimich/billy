import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { SELECT_TYPE_ALL } from '../ui/stats'
import t from '../helpers/i18n'

interface Props {
  types: any[]
  selectedType: string
  handleTypeChange
}

export default class TypesFilterComponent extends React.Component<Props, {}> {

  generateTypeSelectbox() {
    let options: JSX.Element[] = [ <option key={100000}>{SELECT_TYPE_ALL}</option> ]

    for (let type of this.props.types) {
      options.push(<option key={type.id}>{type.type}</option>)
    }

    return (
      <select
        className="form-control"
        id="billType"
        value={this.props.selectedType}
        onChange={this.props.handleTypeChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  render() {
    return (
      <div>

        <label htmlFor="billType">{t('Auftragsart')}</label>
        {this.generateTypeSelectbox()}

      </div>
    )
  }

}