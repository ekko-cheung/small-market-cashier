import { Card, Input, notification, Space, Table, type TableProps } from 'antd'
import { useMemo, useState } from 'react'

type TableData = {
  id: number
  barcode: string
  name: string
  price: number
  quantity: number
  total: number
}

const columns: TableProps<TableData>['columns'] = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '条码',
    dataIndex: 'barcode',
    key: 'barcode'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: '总价',
    dataIndex: 'total',
    key: 'total'
  }
]

export default function FrontDeskSales() {
  const [goods, setGoods] = useState<TableData[]>([])
  const [barcode, setBarcode] = useState('')

  const handleBarcodeEnter = async () => {
    const resp = await window.api.queryGoods({ barcode })
    if (!resp.data || resp.data.length === 0) {
      setBarcode('')
      return notification.error({ title: '查询失败', description: '未找到商品' })
    }

    const good = resp.data[0]
    let existingGood = false
    const newGoods = goods.map((item) => {
      if (item.barcode === good.barcode) {
        item.quantity += 1
        item.total = item.quantity * item.price
        existingGood = true
      }

      return item
    })

    if (!existingGood) {
      newGoods.push({
        id: goods.length + 1,
        barcode: good.barcode!,
        name: good.name!,
        price: good.price!,
        quantity: 1,
        total: good.price!
      })
    }

    setGoods(newGoods)
    setBarcode('')
  }

  const { totalQuntity, totalPrice } = useMemo(() => {
    const totalQuantity = goods.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = goods.reduce((sum, item) => sum + item.total, 0)
    return { totalQuntity: totalQuantity, totalPrice }
  }, [goods])

  return (
    <>
      <Card style={{ marginBottom: '10px' }}>
        <Space>
          <Input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={() => handleBarcodeEnter()}
          />
          <span>总数量: {totalQuntity}</span>
          <span>总价: {totalPrice}</span>
        </Space>
      </Card>
      <Table columns={columns} dataSource={goods} />
    </>
  )
}
