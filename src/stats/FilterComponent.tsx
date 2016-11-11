import * as React from 'react';
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'

export default class FilterComponent extends React.Component<any, {}> {

  props: {
    years: string[];
    types: string[];
    selectedYear: string;
    handleYearChange;
    selectedType: string;
    handleTypeChange;
  }

  constructor(props) {
    super(props)
  }

  generateYearSelectbox() {
    let options: JSX.Element[] = []

    for (let year of this.props.years) {
      options.push(<option key={year}>{year}</option>)
    }

    return (
      <select
        className="form-control"
        id="year"
        value={this.props.selectedYear}
        onChange={this.props.handleYearChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  generateTypeSelectbox() {
    let options: JSX.Element[] = []

    for (let type of this.props.types) {
      options.push(<option key={type}>{type}</option>)
    }

    return (
      <select
        className="form-control"
        id="type"
        value={this.props.selectedType}
        onChange={this.props.handleTypeChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  render() {
    return (
      <form id="filter-container">
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

        <label htmlFor="type">{t('Auftragsart')}</label>
        {this.generateTypeSelectbox()}
        
      </form>
    )
  }

}