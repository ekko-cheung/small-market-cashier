import CreateGoodsDrawer from '@renderer/components/CreateGoodsDrawer'
import { Button, Input, InputNumber, notification, Space, Table, type TableProps } from 'antd'
import { useEffect, useState } from 'react'
import type { Goods } from 'src/shared/types'

export default function GoodsPage(): React.JSX.Element {
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set())
  const [editingValues, setEditingValues] = useState<
    Record<number, { name: string; price: number }>
  >({})

  const columns: TableProps<Goods>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        if (editingIds.has(record.id))
          return (
            <Input
              value={editingValues[record.id]?.name ?? record.name}
              onChange={(e) =>
                setEditingValues((prev) => ({
                  ...prev,
                  [record.id]: { ...editingValues[record.id], name: e.target.value }
                }))
              }
            />
          )
        return record.name
      }
    },
    {
      title: 'barcode',
      dataIndex: 'barcode',
      key: 'barcode'
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        if (editingIds.has(record.id))
          return (
            <InputNumber
              min={0}
              defaultValue={record.price || 0}
              onChange={(e) =>
                setEditingValues((prev) => ({
                  ...prev,
                  [record.id]: { ...editingValues[record.id], price: e || 0 }
                }))
              }
            />
          )

        return record.price
      }
    },
    {
      title: 'createAt',
      dataIndex: 'createAt',
      key: 'createAt'
    },
    {
      render: (_, record) => {
        if (editingIds.has(record.id))
          return (
            <Space>
              <Button
                type="text"
                onClick={async () => {
                  const newName = editingValues[record.id]?.name ?? record.name
                  const newPrice = editingValues[record.id]?.price ?? record.price
                  const resp = await window.api.updateGoods({
                    id: record.id,
                    name: newName,
                    price: newPrice || 0
                  })
                  if (resp.message) {
                    notification.error({ title: '更新失败', description: resp.message })
                  } else {
                    notification.success({ title: '更新成功' })
                    setEditingIds((prev) => {
                      const set = new Set(prev)
                      set.delete(record.id)
                      return set
                    })
                    setEditingValues((prev) => {
                      const { [record.id]: _, ...rest } = prev
                      return rest
                    })
                    fetchGoods()
                  }
                }}
              >
                保存
              </Button>
              <Button
                type="text"
                onClick={() =>
                  setEditingIds((prev) => {
                    const set = new Set(prev)
                    set.delete(record.id)
                    return set
                  })
                }
              >
                取消
              </Button>
            </Space>
          )

        return (
          <Button type="text" onClick={() => setEditingIds((prev) => new Set(prev).add(record.id))}>
            编辑
          </Button>
        )
      }
    }
  ]

  const [goods, setGoods] = useState<Goods[]>([])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const fetchGoods = async () => {
    setEditingIds(new Set())
    setEditingValues({})
    const resp = await window.api.queryGoods({
      limit: pagination.pageSize,
      offset: pagination.current
    })
    if (resp.message)
      return notification.error({ title: '查询商品失败', description: resp.message })

    setGoods(resp.data || [])
    setPagination((prev) => ({ ...prev, total: resp.total || 0 }))
  }

  useEffect(() => {
    fetchGoods()
  }, [pagination.current])

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
  const onCreateDrawerClose = () => {
    setCreateDrawerOpen(false)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  return (
    <>
      <div style={{ marginBottom: '5px' }}>
        <Space>
          <Button onClick={() => window.location.reload()}>刷新</Button>
          <Button type="primary" onClick={() => setCreateDrawerOpen(true)}>
            创建
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={goods}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange(page, pageSize) {
            setPagination((prev) => ({ ...prev, current: page, pageSize }))
          }
        }}
      />

      <CreateGoodsDrawer open={createDrawerOpen} onClose={onCreateDrawerClose} />
    </>
  )
}
