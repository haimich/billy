import * as React from 'react';
// import * as ReactTestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme';
import FilterComponent from '../../src/stats/FilterComponent'

import { expect } from 'chai'

describe('<FilterComponent />', () => {
  it.only('should render', () => {
    const component = (<FilterComponent
        types={['Übersetzen', 'Dolmetschen']}
        years={['2017', '2016']}
        selectedType=""
        selectedYear="2017"
        handleTypeChange={() => console.log('type change')}
        handleYearChange={() => console.log('type change')}
      />
    )
    expect(mount(component).find('.foo').length).to.equal(1)
  })
})
