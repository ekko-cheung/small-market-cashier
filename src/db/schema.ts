import { relations, sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const goodsTable = sqliteTable('goods', {
  id: int().primaryKey({ autoIncrement: true }),
  barcode: text().unique(),
  name: text().default(''),
  price: int().default(0),
  createAt: text().default(sql`(CURRENT_TIMESTAMP)`)
})

export const billsTable = sqliteTable('bills', {
  id: int().primaryKey({ autoIncrement: true }),
  total: int().default(0),
  createAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  payment: int().default(0)
})

export const billItemsTable = sqliteTable('bill_items', {
  id: int().primaryKey({ autoIncrement: true }),
  billId: int(),
  goodId: int(),
  quantity: int().default(0),
  price: int().default(0),
  createAt: text().default(sql`(CURRENT_TIMESTAMP)`)
})

export const paymentsTable = sqliteTable('payments', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().default(''),
  createAt: text().default(sql`(CURRENT_TIMESTAMP)`)
})

export const billsRelations = relations(billsTable, ({ many, one }) => ({
  payment: one(paymentsTable, { fields: [billsTable.payment], references: [paymentsTable.id] }),
  billItems: many(billItemsTable)
}))

export const billItemsRelations = relations(billItemsTable, ({ one }) => ({
  bill: one(billsTable, { fields: [billItemsTable.billId], references: [billsTable.id] }),
  good: one(goodsTable, { fields: [billItemsTable.goodId], references: [goodsTable.id] })
}))
