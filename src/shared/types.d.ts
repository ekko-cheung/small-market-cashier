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

export interface CreateBill {
  items: {
    goodId: number
    quantity: number
    total: number
  }[]
  payment: number
}

export interface QueryBills {
  limit: number
  offset: number
  ltCreateAt?: string
  gtCreateAt?: string
}

export type Goods = typeof goodsTable.$inferSelect
export type Bills = typeof billsTable.$inferInsert & {
  payment: Payments
  billItems: BillItems & { good: Goods }[]
}
export type BillItems = typeof billItemsTable.$inferSelect
export type Payments = typeof paymentsTable.$inferSelect
