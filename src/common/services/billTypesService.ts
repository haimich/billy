import BillType from '../models/BillTypeModel'
import * as billTypesRepo from '../repositories/billTypesRepository'

export function createBillType(billType: BillType): Promise<BillType> {
  return billTypesRepo.createBillType(billType)
}

export function updateBillType(billType: BillType): Promise<BillType> {
  return billTypesRepo.updateBillType(billType)
}

export function getBillTypeById(id: number): Promise<BillType> {
  return billTypesRepo.getBillTypeById(id)
}

export function listBillTypes(): Promise<BillType[]> {
  return billTypesRepo.listBillTypes()
}

export function deleteBillTypeById(id: number): Promise<void> {
  return billTypesRepo.deleteBillTypeById(id)
}

export function deleteBillTypeByNamePattern(namePattern: string): Promise<void> {
  return billTypesRepo.deleteBillTypeByNamePattern(namePattern)
}
