interface Bill {
  id?: number
  bill_id: number
  position: number
  preTaxAmount: number
  taxrate: number
  description?: string
}

export default Bill