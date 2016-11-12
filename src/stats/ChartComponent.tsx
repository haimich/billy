import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let LineChart = require('react-chartjs').Line
let PieChart = require('react-chartjs').Pie

interface Props {
  lineChartLabels: string[];
  lineChartData: number[];
  pieChartLabels: string[];
  pieChartData: number[];
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

  getPieChartData(): any[] {
    let data = []

    for (let i = 0; i < this.props.pieChartLabels.length; i++) {
      let label = this.props.pieChartLabels[i]
      let value = this.props.pieChartData[i]

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
          data={this.getPieChartData()}
          options={{}}
          width="620"
          height="250"
        />
      </div>
    )
  }
}