interface Bill {
  invoice_id: string
  customer_id: number
  date_created: string
  date_paid?: string
  type_id?: number
  comment?: string
}

export default Bill