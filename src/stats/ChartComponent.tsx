import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let LineChart = require('react-chartjs').Line
let PieChart = require('react-chartjs').Pie

interface Props {
  lineChartLabels: string[];
  lineChartData: number[];
  typesPieChartLabels: string[];
  typesPieChartData: number[];
  typesIncomePieChartData: number[];
}

export default class ChartComponent extends React.Component<Props, {}> {

  getLineChartData() {
    return {
        labels: this.props.lineChartLabels,
        datasets: [{
            label: t('Einkommen pro Monat'),
            data: this.props.lineChartData,
            fillColor: 'rgba(75,192,192,0.4)',
            borderWidth: 1,
        }],
    }
  }

  /**
   * Get data for a pie chart displaying the different types of bills
   * with the total count of bills per type, eg:
   * 
   * translate: 15 bills
   * interpret: 5 bills
   * 
   * =>  25% of bills were for interpreting, 75% for translating
   */
  getTypesPieChartData(): any[] {
    let data = []

    for (let i = 0; i < this.props.typesPieChartLabels.length; i++) {
      let label = this.props.typesPieChartLabels[i]
      let value = this.props.typesPieChartData[i]

      data.push({
        label,
        value
      })
    }

    return data
  }

  /**
   * Get data for a pie chart displaying the different types of bills
   * with the total income per type, eg:
   * 
   * translate: 15.000 €
   * interpret:  5.000 €
   * 
   * =>  25% of the income came from interpreting, 75% from translating
   */
  getTypesIncomePieChartData(): any[] {
    let data = []

    for (let i = 0; i < this.props.typesPieChartLabels.length; i++) {
      let label = this.props.typesPieChartLabels[i]
      let value = this.props.typesIncomePieChartData[i]

      data.push({
        label,
        value
      })
    }

    return data
  }

  render() {    
    return (
      <div>
        <LineChart
          data={this.getLineChartData()}
          options={{}}
          width="620"
          height="250"
        />

        <PieChart
          data={this.getTypesPieChartData()}
          options={{}}
          width="310"
          height="250"
        />

        <PieChart
          data={this.getTypesIncomePieChartData()}
          options={{}}
          width="310"
          height="250"
        />

        <div className="label-container">
          <section>{t('Anzahl Aufträge nach Typ')}</section>
          <section className="pull-right">{t('Anzahl Aufträge nach Umsatz')}</section>
        </div>
      </div>
    )
  }
}