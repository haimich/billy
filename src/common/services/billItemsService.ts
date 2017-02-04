import BillItem from '../models/BillItem'
import * as billItemsRepo from '../repositories/billItemsRepository'

export function createBillItem(BillItem: BillItem): Promise<BillItem> {
  return billItemsRepo.createBillItem(BillItem)
}

export function updateBillItem(BillItem: BillItem): Promise<BillItem> {
  return billItemsRepo.updateBillItem(BillItem)
}

export function getBillItemById(id: number): Promise<BillItem> {
  return billItemsRepo.getBillItemById(id)
}

export function getBillItemsByBillId(billId: number): Promise<BillItem[]> {
  return billItemsRepo.getBillItemsByBillId(billId)
}

export function deleteBillItemById(id: number): Promise<void> {
  return billItemsRepo.deleteBillItemById(id)
}

export function deleteBillItemByDescriptionPattern(descriptionPattern: string): Promise<void> {
  return billItemsRepo.deleteBillItemByDescriptionPattern(descriptionPattern)
}
