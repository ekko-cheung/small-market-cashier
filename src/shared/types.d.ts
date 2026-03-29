import { billItemsTable, billsTable, goodsTable, paymentsTable } from '../db/schema'

export interface CreateGood {
  name: string
  price: number
  barcode: string
}

export interface QueryGoods {
  barcode?: string
  name?: string
  limit?: number
  offset?: number
}

export interface UpdateGoods {
  id: number
  name: string
  price: number
}

export interface Result<T> {
  data?: T
  message?: string
  total?: number
}

export type Goods = typeof goodsTable.$inferSelect
export type Bills = typeof billsTable.$inferSelect
export type BillItems = typeof billItemsTable.$inferSelect
export type Payments = typeof paymentsTable.$inferSelect
