export default class BillDbModel {
  constructor(
    public id: string,
    public amount: number,
    public date_created: Date,
    public date_paid?: Date,
    public comment?: string,
    public file_path?: string,
    public customer_name?: string,
    public customer_telephone?: string,
  ) {
    // fields get set by Typescript automatically
  }
}