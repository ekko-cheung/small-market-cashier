import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { CreateBill, CreateGood, QueryGoods, UpdateGoods } from '../shared/types'

// Custom APIs for renderer
const api = {
  createGoods: (goods: CreateGood) => {
    return ipcRenderer.invoke('goods:create', goods)
  },
  queryGoods: (query: QueryGoods) => {
    return ipcRenderer.invoke('goods:query', query)
  },
  updateGoods: (goods: UpdateGoods) => {
    return ipcRenderer.invoke('goods:update', goods)
  },
  createBills: (bills: CreateBill) => ipcRenderer.invoke('bills:create', bills),
  queryBills: (query: QueryGoods) => ipcRenderer.invoke('bills:query', query),
  createPayments: (name: string) => ipcRenderer.invoke('payments:create', name),
  queryPayments: () => ipcRenderer.invoke('payments:query'),
  queryBillsTodaySalesNumberAndOrder: () => ipcRenderer.invoke('bills:todaySalesNumberAndOrders'),
  queryBillsLast7DaysGrouped: () => ipcRenderer.invoke('bills:salesLast7daysGrouped')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
