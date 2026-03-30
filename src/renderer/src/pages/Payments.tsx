import { Button, Card, Input, notification, Space, Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import type { Payments } from 'src/shared/types'

export default function PaymentsPage() {
  const columns: TableProps<Payments>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt'
    }
  ]

  const [payments, setPayments] = useState<Payments[]>([])
  const fetchPayments = async () => {
    const result = await window.api.queryPayments()
    if (result.data) setPayments(result.data)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const [name, setName] = useState('')
  const handleAddPayment = async () => {
    await window.api.createPayments(name)
    notification.success({ title: '添加成功' })
    setName('')
    fetchPayments()
  }

  return (
    <>
      <Card style={{ marginBottom: 12 }}>
        <Space>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="primary" onClick={handleAddPayment}>
            添加
          </Button>
        </Space>
      </Card>
      <Table columns={columns} dataSource={payments} />
    </>
  )
}
