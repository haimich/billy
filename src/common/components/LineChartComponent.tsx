import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../helpers/i18n'
import { COLORS, getLineChartData } from '../ui/stats'
let LineChart = require('react-chartjs').Line

interface Props {
  lineChartHeading: string
  lineChartDataLabel: string
  lineChartLabels: string[]
  lineChartDatePaidData: number[]
}

export default class LineChartComponent extends React.Component<Props, {}> {

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <LineChart
            data={getLineChartData(this.props.lineChartLabels, this.props.lineChartDataLabel, this.props.lineChartDatePaidData)}
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
            <section className="chart-heading">{this.props.lineChartHeading}</section>
          </div>
        </div>

      </div>
    )
  }

}
