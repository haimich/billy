export default class Customer {
  constructor(
    public id: number,
    public name: string,
    public telephone: string
  ) {
    // fields get set by Typescript automatically
  }
}