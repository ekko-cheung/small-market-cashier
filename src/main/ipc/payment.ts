import { ipcMain } from 'electron'
import db from '../../db'
import { paymentsTable } from '../../db/schema'

export default function initPayments() {
  ipcMain.handle('payments:create', async (_, name: string) => await addPayment(name))
  ipcMain.handle('payments:query', async () => await queryPayments())
}

async function addPayment(name: string) {
  await db.insert(paymentsTable).values({ name })

  return {}
}

async function queryPayments() {
  return {
    data: await db.query.paymentsTable.findMany()
  }
}
