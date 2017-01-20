import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let LineChart = require('react-chartjs').Line
let PieChart = require('react-chartjs').Pie

interface Props {
  lineChartLabels: string[]
  lineChartDatePaidData: number[]
  typesPieChartLabels: string[]
  typesPieChartData: number[]
  typesIncomePieChartData: number[]
}

interface State {
  typesPiechartLegend: any;
  typesIncomePiechartLegend: any;
}

const colors = [
  '54, 162, 235',
  '255, 105, 180',
  '243, 134, 47',
  '136, 216, 176',
  '255, 204, 92',
  '119, 91, 163',
  '47, 47, 47',
  '210, 117, 117',
  '209, 31, 63',
  '234, 240, 241',
  '246, 41, 106'
]

export default class BillsChartComponent extends React.Component<Props, State> {

  refs: {
    typesPiechart;
    typesIncomePiechart
  }

  getLineChartData() {
    return {
        labels: this.props.lineChartLabels,
        datasets: [{
            label: t('Einkommen nach Bezahldatum'),
            data: this.props.lineChartDatePaidData,
            fillColor: `rgba(${colors[0]}, 0.2)`,
            pointColor: `rgba(${colors[0]}, 0.4)`,
            borderWidth: 1,
        }]
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

      if (colors.length >= i+1) {
        color = 'rgba(' + colors[i] + ', 0.4)'
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
      <div className="container-fluid">
        <div className="row">
          <LineChart
            data={this.getLineChartData()}
            options={{
              responsive: true
            }}
            ref="chart"
            width="620"
            height="250"
            className="col-xs-12"
          />
        </div>

        <div className="row">
          <div className="col-xs-12 label-container">
            <section className="chart-heading">{t('Umsatz')}</section>
          </div>
        </div>

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
    let typesPiechartLegend = this.refs.typesPiechart.getChart().generateLegend();
    let typesIncomePiechartLegend = this.refs.typesPiechart.getChart().generateLegend();

    this.setState({
      typesPiechartLegend,
      typesIncomePiechartLegend
    });
  }

}
