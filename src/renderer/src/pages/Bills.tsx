import { Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { Bills } from 'src/shared/types'

export default function BillsPage() {
  const columns: TableProps<Bills>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '金额',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: '支付方式',
      dataIndex: ['payment', 'name'],
      key: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt'
    }
  ]

  const [bills, setBills] = useState<Bills[]>([])
  const fetchBills = async () => {
    const result = await window.api.queryBills({
      limit: 10,
      offset: 1
    })
    if (result.data) setBills(result.data)
    console.log(result)
  }
  useEffect(() => {
    fetchBills()
  }, [])

  return (
    <>
      <Table columns={columns} dataSource={bills} />
    </>
  )
}
