import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { COLORS } from '../../ui/stats'
const PieChart = require('react-chartjs').Pie

interface Props {
  labels: string[]
  data: number[]
  heading: string
}


interface State {
  legend: any
}

export default class PieChartComponent extends React.Component<Props, State> {

  refs: {
    piechart
  }

  constructor(props) {
    super(props)

    this.state = {
      legend: ''
    }
  }

  getPieChartData(): any[] {
    let data = []

    for (let i = 0; i < this.props.labels.length; i++) {
      let label = this.props.labels[i]
      let value = this.props.data[i]
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

  generateLeged() {
    if (this.refs.piechart != null && this.refs.piechart.getChart() != null) {
      return this.refs.piechart.getChart().generateLegend()
    }
  }

  render() {
    return (
      <div className="pie-container">
        <PieChart
          data={this.getPieChartData()}
          ref="piechart"
          options={{
            responsive: true
          }}
          height="140"
        />

        <section className="label-container chart-heading">{this.props.heading}</section>

        <div className="pie-legend-container" dangerouslySetInnerHTML={{ __html: this.state.legend }} />
      </div>
    )
  }

  componentDidMount() {
    this.setState({
      legend: this.generateLeged()
    })
  }

}