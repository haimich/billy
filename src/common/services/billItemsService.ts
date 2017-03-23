import BillItem from '../models/BillItemModel'
import * as billItemsRepo from '../repositories/billItemsRepository'

export function createBillItem(billItem: BillItem): Promise<BillItem> {
  return billItemsRepo.createBillItem(billItem)
}

export function updateBillItem(billItem: BillItem): Promise<BillItem> {
  return billItemsRepo.updateBillItem(billItem)
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
