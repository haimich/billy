import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
import { COLORS, getLineChartData } from '../common/ui/stats'
let LineChart = require('react-chartjs').Line
let PieChart = require('react-chartjs').Pie

interface Props {
  typesPieChartLabels: string[]
  typesPieChartData: number[]
  typesIncomePieChartData: number[]
}

interface State {
  typesPiechartLegend: any;
  typesIncomePiechartLegend: any;
}

export default class BillsChartComponent extends React.Component<Props, State> {

  refs: {
    typesPiechart;
    typesIncomePiechart
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

      if (COLORS.length >= i+1) {
        color = 'rgba(' + COLORS[i] + ', 0.4)'
      }

      data.push({
        label,
        value,
        color,
        fillColor: color
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

      if (COLORS.length >= i+1) {
        color = 'rgba(' + COLORS[i] + ', 0.4)'
      }

      data.push({
        label,
        value,
        color,
        fillColor: color
      })
    }

    return data
  }

  render() {
    let typesPiechartLegend = this.state && this.state.typesPiechartLegend || '';
    let typesIncomePiechartLegend = this.state && this.state.typesIncomePiechartLegend || '';

    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <PieChart
              data={this.getTypesPieChartData()}
              ref="typesPiechart"
              options={{
                responsive: true
              }}
              width="310"
            />
          </div>

          <div className="col-xs-6">
            <PieChart
              data={this.getTypesIncomePieChartData()}
              ref="typesIncomePiechart"
              options={{
                responsive: true
              }}
              width="310"
            />
          </div>
        </div>

        <div className="row">
            <section className="col-xs-6 label-container chart-heading">{t('Aufträge nach Typ')}</section>
            <section className="col-xs-6 label-container chart-heading">{t('Aufträge nach Umsatz (€)')}</section>
        </div>

        <div className="row">
          <div className="col-xs-6">
            <div dangerouslySetInnerHTML={{ __html: typesPiechartLegend }} />
          </div>
          <div className="col-xs-6">
            <div dangerouslySetInnerHTML={{ __html: typesIncomePiechartLegend }} />
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    let typesPiechartLegend = this.refs.typesPiechart.getChart().generateLegend()
    let typesIncomePiechartLegend = this.refs.typesPiechart.getChart().generateLegend()

    this.setState({
      typesPiechartLegend,
      typesIncomePiechartLegend
    })
  }

}
