import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
let LineChart = require('react-chartjs').Line

interface Props {
  labels: string[];
  data: number[];
}

export default class ChartComponent extends React.Component<Props, {}> {

  render() {
    let chartData = {
        labels: this.props.labels,
        datasets: [{
            label: 'Income per month',
            xAxisID: t('Monate'),
            yAxisID: t('Umsatz'),
            data: this.props.data,
            fillColor: 'rgba(75,192,192,0.4)',
            borderWidth: 1,
        }],
    }
    
    const chartOptions = {
    }

    return (
      <LineChart
        data={chartData}
        options={chartOptions}
        width="600"
        height="250"
      />
    )
  }
}