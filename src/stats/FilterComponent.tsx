import * as React from 'react';
import * as ReactDOM from 'react-dom'
import BillTypeModel from '../common/models/BillTypeModel'
import t from '../common/helpers/i18n'

export const SELECT_TYPE_ALL = t('Alle')

interface Props {
  years: string[]
  billTypes: BillTypeModel[]
  selectedYear: string
  handleYearChange
  selectedBillType: string
  handleBillTypeChange
  billDateToUse: 'date_paid' | 'date_created'
  changeBillDateToUse
}

export default class FilterComponent extends React.Component<Props, {}> {

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

  generateBillTypeSelectbox() {
    let options: JSX.Element[] = [ <option key={100000}>{SELECT_TYPE_ALL}</option> ]

    for (let type of this.props.billTypes) {
      options.push(<option key={type.id}>{type.type}</option>)
    }

    return (
      <select
        className="form-control"
        id="billType"
        value={this.props.selectedBillType}
        onChange={this.props.handleBillTypeChange.bind(this)}
      >
        {options}
      </select>
    )
  }

  isDatefieldSelected(dateField: string): boolean {
    return this.props.billDateToUse === dateField
  }

  handleRadiobuttonClick(dateField) {
    this.props.changeBillDateToUse(dateField)
  }

  render() {
    return (
      <form id="filter-container">
        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

        <label htmlFor="billType">{t('Auftragsart')}</label>
        {this.generateBillTypeSelectbox()}

        <label>{t('Datumsfeld')}</label>
        <p>
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.isDatefieldSelected('date_paid')}
              onChange={() => this.handleRadiobuttonClick('date_paid')}
            /> {t('Bezahldatum')}
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              checked={this.isDatefieldSelected('date_created')}
              onChange={() => this.handleRadiobuttonClick('date_created')}
            /> {t('Rechnungsdatum')}
          </label>
        </p>
        
      </form>
    )
  }

}