import { and, desc, eq, like, SQL } from 'drizzle-orm'
import db from '../../db/index'
import { goodsTable } from '../../db/schema'
import { ipcMain } from 'electron'
import type { CreateGood, QueryGoods, UpdateGoods } from '../../shared/types'

export default function initGoods() {
  ipcMain.handle('goods:create', async (_, good: CreateGood) => {
    return await createGoods(good)
  })

  ipcMain.handle('goods:query', async (_, query: QueryGoods) => {
    return await queryGoods(query)
  })

  ipcMain.handle('goods:update', async (_, goods: UpdateGoods) => {
    return await updateGoods(goods)
  })
}

async function createGoods(good: CreateGood) {
  const existingGood = await db.query.goodsTable.findFirst({
    where: eq(goodsTable.barcode, good.barcode)
  })
  if (existingGood) return { message: '商品已存在' }

  await db.insert(goodsTable).values(good)

  return {}
}

async function queryGoods(query: QueryGoods) {
  const filters: SQL[] = []

  if (query.name) filters.push(like(goodsTable.name, `%${query.name}%`))
  if (query.barcode) filters.push(eq(goodsTable.barcode, query.barcode))

  const goods = await db.query.goodsTable.findMany({
    where: and(...filters),
    limit: query.limit ?? 10,
    offset: (query.limit ?? 1) * ((query.offset ?? 1) - 1),
    orderBy: [desc(goodsTable.createAt)]
  })

  const total = await db.$count(goodsTable, and(...filters))

  return {
    data: goods,
    total
  }
}

async function updateGoods(goods: UpdateGoods) {
  await db
    .update(goodsTable)
    .set({
      name: goods.name,
      price: goods.price
    })
    .where(eq(goodsTable.id, goods.id))

  return {}
}
