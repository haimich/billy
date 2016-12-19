import * as React from 'react'
import * as ReactDOM from 'react-dom'
import t from '../common/helpers/i18n'
const Typeahead = require('react-bootstrap-typeahead').default

interface State {
  data: any[]
}

interface Props {
  getData: () => Promise<any[]>
  handleChange: (selectedValue: any) => void
  selectedValue: any[]
  labelKey: string
  htmlName: string
  required: boolean
  newSelectionPrefix: string
  tabIndex?: number
}

export default class TypeaheadComponent extends React.Component<Props, {}> {

  refs: {
    typeahead: any
  }

  state: State

  constructor(props) {
    super(props)

    this.state = {
      data: []
    }

    this.fetchTypeaheadData()
  }

  async fetchTypeaheadData() {
    try {
      let data = await this.props.getData()
      this.setState({ data })
    } catch (err) {
      console.error('Could not fetch typeahead data', err)
    }
  }

  resetState() { //TODO call
    this.refs.typeahead.getInstance().clear()
    this.fetchTypeaheadData()
  }

  render() {
    return (
      <Typeahead
        options={this.state.data}
        allowNew={true}
        onChange={this.props.handleChange.bind(this)}
        onBlur={this.props.handleChange.bind(this)}
        selected={this.props.selectedValue}
        labelKey={this.props.labelKey}
        ref='typeahead'
        name={this.props.htmlName}
        placeholder=""
        emptyLabel={t('Keine Einträge vorhanden')}
        newSelectionPrefix={this.props.newSelectionPrefix}
        tabIndex={this.props.tabIndex}
      />
    )
  }

  componentDidMount() {
    // Hack: enable features for Typeahead component
    const typeaheadInput =
      ReactDOM.findDOMNode(this.refs.typeahead.getInstance()).querySelector(`input[name=${this.props.htmlName}]`)
    typeaheadInput.setAttribute('id', this.props.htmlName)
    typeaheadInput.setAttribute('required', '' + this.props.required)
  }

}