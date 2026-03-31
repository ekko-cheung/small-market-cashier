import { ipcMain } from 'electron'
import db from '../../db'
import { billItemsTable, billsTable } from '../../db/schema'
import type { CreateBill, QueryBills } from '../../shared/types'
import { and, count, desc, gt, lt, SQL, sum, sql } from 'drizzle-orm'

export default function initBills() {
  ipcMain.handle('bills:create', async (_, data: CreateBill) => await createBill(data))
  ipcMain.handle('bills:query', async (_, query: QueryBills) => await queryBills(query))
  ipcMain.handle(
    'bills:todaySalesNumberAndOrders',
    async () => await queryTodaySalesNumberAndOrders()
  )
  ipcMain.handle('bills:salesLast7daysGrouped', async () => await getSalesLast7DaysGrouped())
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
      billItems: {
        with: {
          good: true
        }
      }
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

async function getSalesLast7DaysGrouped() {
  const result = await db.run(
    sql`SELECT strftime('%Y-%m-%d', createAt) as date, SUM(total) as sales FROM bills WHERE createAt >= date('now', '-7 days') GROUP BY date ORDER BY date`
  )

  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('en-CA'))
  }

  const salesMap = new Map()
  result.rows.forEach((row: any) => {
    salesMap.set(row.date, row.sales)
  })

  const fullData = dates.map((date) => ({
    date,
    sales: salesMap.get(date) || 0
  }))

  return {
    data: fullData
  }
}

async function queryTodaySalesNumberAndOrders() {
  const date = new Date().toLocaleDateString('en-CA')
  const startDateTime = date + ' 00:00:00'
  const endDateTime = date + ' 23:59:59'
  const result = await db
    .select({ sales: sum(billsTable.total), orders: count() })
    .from(billsTable)
    .where(and(gt(billsTable.createAt, startDateTime), lt(billsTable.createAt, endDateTime)))

  return {
    data: result
  }
}
