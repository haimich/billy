import * as React from 'react'
import * as ReactDOM from 'react-dom'
const chartjs = require('chart.js')

export default class ChartComponent extends React.Component<any, {}> {

  constructor(props) {
    super(props)

    console.log(chartjs)
  }

  render() {
    return (
      <div>foo</div>
    )
  }
}