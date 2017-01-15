import ExpensesEditorComponent from '../../src/main/ExpensesEditorComponent'
import Expense from '../../src/common/models/ExpenseModel'
import { expect } from 'chai'

describe('main.ExpensesEditorComponent', () => {
  let component

  beforeEach(() => {
    component = new ExpensesEditorComponent({})    
  })

  describe('getNetAmount', () => {
    // it('should return the net amount of the given preTaxAmount', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45',
    //     taxrate: 10
    //   }
    //   component.state = state

    //   expect(component.getNetAmount()).to.equal('112,23')
    // })

    // it('should return the net amount of the given preTaxAmount for large numbers', () => {
    //   let state: any = {
    //     preTaxAmount: '123213412,99',
    //     taxrate: 19
    //   }
    //   component.state = state

    //   expect(component.getNetAmount()).to.equal('103540683,18')
    // })

    // it('should return return the input value when the taxrate is 0', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45',
    //     taxrate: 0
    //   }
    //   component.state = state

    //   expect(component.getNetAmount()).to.equal('123,45')
    // })
  })

  describe('getVatAmount', () => {
    // it('should return the vat amount of the given taxrate', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45',
    //     taxrate: 10
    //   }
    //   component.state = state

    //   expect(component.getVatAmount()).to.equal('11,22')
    // })

    // it('should return 0 when the taxrate is 0', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45',
    //     taxrate: 0
    //   }
    //   component.state = state

    //   expect(component.getVatAmount()).to.equal('')
    // })
  })

  describe('getTaxrate', () => {
    it('should return the taxrate of the given preTax and vat amount', () => {
      let state: any = {
        preTaxAmount: '123,45',
        vatAmount: '11,22'
      }
      component.state = state

      expect(component.getTaxrate()).to.equal('10')
    })

    //  it('should calculate the taxrate if the vatAmount is missing', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45'
    //   }
    //   component.state = state

    //   expect(component.getTaxrate()).to.equal('10')
    // })

    it('should return the value from the state if none of the other values is present', () => {
      let state: any = {
        preTaxAmount: '',
        vatAmount: '',
        taxrate: '15'
      }
      component.state = state

      expect(component.getTaxrate()).to.equal('15')
    })

    // it('should return 0 when the taxrate is 0', () => {
    //   let state: any = {
    //     preTaxAmount: '123,45',
    //     taxrate: 0
    //   }
    //   component.state = state

    //   expect(component.getVatAmount()).to.equal('')
    // })
  })

})