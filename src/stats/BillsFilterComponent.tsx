import * as React from 'react';
import * as ReactDOM from 'react-dom'
import StatsFilterComponent from '../common/components/StatsFilterComponent'
import BillTypeModel from '../common/models/BillTypeModel'
import { SELECT_TYPE_ALL } from '../common/ui/stats'
import t from '../common/helpers/i18n'

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

export default class BillsFilterComponent extends React.Component<Props, {}> {

  isDatefieldSelected(dateField: string): boolean {
    return this.props.billDateToUse === dateField
  }

  handleRadiobuttonClick(dateField) {
    this.props.changeBillDateToUse(dateField)
  }

  render() {
    return (
      <form id="filter-container">
      
        <StatsFilterComponent
          years={this.props.years}
          types={this.props.billTypes}
          handleYearChange={this.props.handleYearChange.bind(this)}
          handleTypeChange={this.props.handleBillTypeChange.bind(this)}
          selectedType={this.props.selectedBillType}
          selectedYear={this.props.selectedYear}
          dateFieldName={this.props.billDateToUse}
        />

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