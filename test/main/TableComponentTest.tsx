import * as React from 'react'
import TableComponent from '../../src/main/TableComponent'
import { mount, shallow } from 'enzyme'
import { expect } from 'chai'
import * as moment from 'moment'
import { prepareDom } from '../helpers'

import { app, BrowserWindow } from 'electron'
import { getAppFolder } from '../../src/common/helpers/app'

describe('<TableComponent />', () => {

  it('calls componentDidMount', () => {
    const wrapper = mount(
      <TableComponent
        bills={[{
          invoice_id: '2016/123',
          customer: {
            id: 1,
            name: 'Hans Grohe'
          },
          customer_name: 'Hans Grohe',
          date_created: moment().toISOString(),
          amount: 100
        }]}
        delete={() => console.log('delete')}
        select={() => console.log('select')}
        />
    )
    // expect(wrapper.find('table').length).to.have.length(1)
    
  })

})