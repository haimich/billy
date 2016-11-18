import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils'
import FilterComponent from '../../src/stats/FilterComponent'

import { expect } from 'chai'

describe('test', () => {
  it.only('should test', () => {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render(
      <FilterComponent
        types={['Übersetzen', 'Dolmetschen']}
        years={['2017', '2016']}
        selectedType=""
        selectedYear="2017"
        handleTypeChange={() => console.log('type change')}
        handleYearChange={() => console.log('type change')}
      />)

    console.log(renderer.getRenderOutput())
  })
})
