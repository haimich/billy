import * as React from 'react';
import * as ReactDOM from 'react-dom'
import Bill from '../common/models/BillDbModel'
import Customer from '../common/models/CustomerModel'
import t from '../common/helpers/i18n'
import { dateFormatterYearView } from '../common/helpers/formatters'
import { desc } from '../common/helpers/sorters'

export class FormComponent extends React.Component<any, {}> {

  props: {
    customers: Customer[];
    bills: Bill[];
  }

  constructor(props) {
    super(props)
  }

  getAvailableYears(): string[] {
    let years: string[] = []

    for (let bill of this.props.bills) {
      let dateCreated = dateFormatterYearView(bill.date_created)
      if (years.indexOf(dateCreated) === -1) {
        years.push(dateCreated)
      }
    }

    return years.sort(desc)
  }

  generateYearSelectbox() {
    let options: JSX.Element[] = []

    for (let year of this.getAvailableYears()) {
      options.push(<option key={year}>{year}</option>)
    }

    return (
      <select className="form-control" id="year">
        {options}
      </select>
    )
  }

  render() {
    return (
      <form>

        <label htmlFor="year">{t('Jahr')}</label>
        {this.generateYearSelectbox()}

      </form>
    )
  }

}