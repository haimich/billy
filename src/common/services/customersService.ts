import Customer from '../models/CustomerModel'
import * as customersRepo from '../repositories/customersRepository'

export function createCustomer(customer: Customer): Promise<Customer> {
  return customersRepo.createCustomer(customer)
}

export function updateCustomer(customer: Customer): Promise<Customer> {
  return customersRepo.updateCustomer(customer)
}

export function getCustomerById(id: number): Promise<Customer> {
  return customersRepo.getCustomerById(id)
}

export function listCustomers(): Promise<Customer[]> {
  return customersRepo.listCustomers()
}

export function deleteCustomerById(id: number): Promise<void> {
  return customersRepo.deleteCustomerById(id)
}

export function deleteCustomerByNamePattern(namePattern: string): Promise<void> {
  return customersRepo.deleteCustomerByNamePattern(namePattern)
}