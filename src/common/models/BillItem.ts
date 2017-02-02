interface Bill {
  id: number
  bill_id: number
  position: 0
  preTaxAmount: number
  taxrate: number
  description?: string
}

export default Bill