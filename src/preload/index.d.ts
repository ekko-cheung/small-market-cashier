import { ElectronAPI } from '@electron-toolkit/preload'
import type {
  Goods,
  Result,
  CreateGood,
  QueryGoods,
  UpdateGoods,
  CreateBill,
  Bills,
  Payments,
  QueryBills
} from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      createGoods: (goods: CreateGoods) => Promise<Result<void>>
      queryGoods: (query: QueryGoods) => Promise<Result<Goods[]>>
      updateGoods: (goods: UpdateGoods) => Promise<Result<void>>
      createBills: (bills: CreateBill) => Promise<Result<void>>
      queryBills: (query: QueryBills) => Promise<Result<Bills[]>>
      createPayments: (payment: name) => Promise<Result<void>>
      queryPayments: () => Promise<Result<Payments[]>>
      queryBillsTodaySalesNumberAndOrder: () => Promise<Result<{ sales: number; orders: number }[]>>
      queryBillsLast7DaysGrouped: () => Promise<Result<{ date: string; sales: number }[]>>
    }
  }
}
