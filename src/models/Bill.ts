export default class Bill {
  constructor(
    public id: string,
    public customer: string,
    public amount: number,
    public date_created: Date,
    public date_paid: Date
  ) {
    // fields get set by Typescript automatically
  }
}