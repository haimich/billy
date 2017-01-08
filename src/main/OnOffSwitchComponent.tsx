import * as React from 'react'
import * as ReactDOM from 'react-dom'
const ToggleButton = require('react-toggle-button')

interface Props {
  inactiveLabel: string
  activeLabel: string
  selectedValue: string
  handleValueChange: (newValue: string) => void
}

export default class OnOffSwitchComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  isSelected(): boolean {
    if (this.props.selectedValue === this.props.inactiveLabel) {
      return false
    } else if (this.props.selectedValue === this.props.activeLabel) {
      return true
    }
  }

  getToggledValue(): string {
    return this.isSelected()
      ? this.props.inactiveLabel
      : this.props.activeLabel
  }

  toggle() {
    this.props.handleValueChange(this.getToggledValue())
  }

  render() {
    return (
      <div className="onoffswitch-container">
        <ToggleButton
          inactiveLabel={this.props.inactiveLabel}
          activeLabel={this.props.activeLabel}
          value={this.isSelected()}
          onToggle={this.toggle.bind(this)}
        />
      </div>
    )
  }

}