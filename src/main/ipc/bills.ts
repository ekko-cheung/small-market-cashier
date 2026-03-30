import { ipcMain } from 'electron'
import db from '../../db'
import { billItemsTable, billsTable } from '../../db/schema'
import type { CreateBill, QueryBills } from '../../shared/types'
import { and, desc, gt, lt, SQL } from 'drizzle-orm'

export default function initBills() {
  ipcMain.handle('bills:create', async (_, data: CreateBill) => await createBill(data))
  ipcMain.handle('bills:query', async (_, query: QueryBills) => await queryBills(query))
}

async function createBill(data: CreateBill) {
  const total = data.items.reduce((total, item) => total + item.total, 0)
  const resp = await db.insert(billsTable).values({
    total,
    payment: data.payment
  })
  const billId = resp.lastInsertRowid!

  const billItems = data.items.map((item) => {
    return {
      billId: Number(billId),
      goodId: item.goodId,
      quantity: item.quantity,
      price: item.total
    }
  })
  await db.insert(billItemsTable).values(billItems)

  return {}
}

async function queryBills(query: QueryBills) {
  const filters: SQL[] = []
  if (query.ltCreateAt) {
    filters.push(lt(billsTable.createAt, query.ltCreateAt))
  }
  if (query.gtCreateAt) {
    filters.push(gt(billsTable.createAt, query.gtCreateAt))
  }

  const bills = await db.query.billsTable.findMany({
    with: {
      payment: true,
      billItems: true
    },
    where: and(...filters),
    limit: query.limit,
    offset: (query.offset - 1) * query.limit,
    orderBy: [desc(billsTable.createAt)]
  })
  const total = await db.$count(billsTable, and(...filters))

  return {
    data: bills,
    total
  }
}
