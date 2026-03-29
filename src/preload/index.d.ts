import { ElectronAPI } from '@electron-toolkit/preload'
import type { Goods, Result, CreateGood, QueryGoods, UpdateGoods } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      createGoods: (goods: CreateGoods) => Promise<Result<void>>
      queryGoods: (query: QueryGoods) => Promise<Result<Goods[]>>      updateGoods: (goods: UpdateGoods) => Promise<Result<void>>    }
  }
}
