import Customer from '../models/CustomerModel'

let db

export async function init(knexInstance): Promise<any> {
  db = knexInstance
}

export function createCustomer(customer: Customer): Promise<Customer> {
  return db('customers')
    .insert(customer)
    .then((rows) => {
      return getCustomerById(rows[0])
    })
}

function getCustomerById(id: number): Promise<Customer> {
  return db('customers')
    .where('id', id)
    .first()
}

export function listCustomers(): Promise<Customer[]> {
  return db('customers')
    .select('*')
    .orderBy('name')
}

export function deleteCustomerByNamePattern(namePattern: string): Promise<void> {
  return db('customers')
    .delete()
    .where('name', 'like', namePattern)
}