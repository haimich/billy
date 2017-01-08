import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Props {
  activeLabel: string
  inactiveLabel: string
  selectedValue: string
  handleValueChange: (newValue: string) => void
}

export default class OnOffSwitchComponent extends React.Component<Props, {}> {

  constructor(props) {
    super(props)
  }

  isSelected(): boolean {
    if (this.props.selectedValue === this.props.activeLabel) {
      return false
    } else if (this.props.selectedValue === this.props.inactiveLabel) {
      return true
    }
  }

  getToggledValue(): string {
    return this.isSelected()
      ? this.props.activeLabel
      : this.props.inactiveLabel
  }

  toggle() {
    this.props.handleValueChange(this.getToggledValue())
  }

  render() {
    return (
      <div className="onoffswitch-container">
        <div className="toggle toggle--knob">
          <input type="checkbox" id="toggle--knob" className="toggle--checkbox" checked={this.isSelected()} onChange={this.toggle.bind(this)} />
          <label className="toggle--btn" htmlFor="toggle--knob">
            <span
              className="toggle--feature"
              data-label-on={this.props.activeLabel}
              data-label-off={this.props.inactiveLabel}
            />
          </label>
        </div>
      </div>
    )
  }

}