import * as React from 'react'
import * as ReactDOM from 'react-dom'
import PieChartComponent from '../common/components/stats/PieChartComponent'
import t from '../common/helpers/i18n'

interface Props {
  typesPieChartLabels: string[]
  typesPieChartData: number[]
  typesIncomePieChartData: number[]
}

export default class BillsChartComponent extends React.Component<Props, {}> {

  render() {
    return (
      <div>

        <div className="row">
          <div className="col-xs-6">
            <PieChartComponent
              data={this.props.typesPieChartData}
              labels={this.props.typesPieChartLabels}
              heading={t('Aufträge nach Typ')}
            />
          </div>

          <div className="col-xs-6">
            <PieChartComponent
              data={this.props.typesIncomePieChartData}
              labels={this.props.typesPieChartLabels}
              heading={t('Aufträge nach Umsatz (€)')}
            />
          </div>
        </div>

      </div>
    )
  }

}
