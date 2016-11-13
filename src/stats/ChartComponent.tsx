import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let LineChart = require('react-chartjs').Line
let PieChart = require('react-chartjs').Pie

interface Props {
  lineChartLabels: string[]
  lineChartDatePaidData: number[]
  lineChartDateCreatedData: number[]
  typesPieChartLabels: string[]
  typesPieChartData: number[]
  typesIncomePieChartData: number[]
}

const colors = [
  '54, 162, 235', '255, 105, 180'
]

export default class ChartComponent extends React.Component<Props, {}> {

  getLineChartData() {
    return {
        labels: this.props.lineChartLabels,
        datasets: [{
            label: t('Einkommen nach Bezahldatum'),
            data: this.props.lineChartDatePaidData,
            fillColor: `rgba(${colors[0]}, 0.2)`,
            pointColor: `rgba(${colors[0]}, 0.4)`,
            borderWidth: 1,
        }, {
            label: t('Einkommen nach Rechnungsdatum'),
            data: this.props.lineChartDateCreatedData,
            fillColor: `rgba(${colors[1]}, 0.2)`,
            pointColor: `rgba(${colors[1]}, 0.4)`,
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
      let color = 'rgba(54, 162, 235, 0.4)'

      if (colors.length >= i+1) {
        color = 'rgba(' + colors[i] + ', 0.4)'
      }

      data.push({
        label,
        value,
        color
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
      let color = 'rgba(54, 162, 235, 0.4)'

      if (colors.length >= i+1) {
        color = 'rgba(' + colors[i] + ', 0.4)'
      }

      data.push({
        label,
        value,
        color
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
          ref="chart"
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