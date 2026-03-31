import { Table, TableProps, DatePicker, Button, Space } from 'antd'
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
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const fetchBills = async (
    page: number = 1,
    size: number = 10,
    startDate?: string,
    endDate?: string
  ) => {
    const query: any = { limit: size, offset: page }
    if (startDate) query.gtCreateAt = startDate + ' 00:00:00'
    if (endDate) query.ltCreateAt = endDate + ' 23:59:59'
    const result = await window.api.queryBills(query)
    if (result.data) {
      setBills(result.data)
      setTotal(result.total || 0)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    if (dateRange) {
      fetchBills(1, pageSize, dateRange[0], dateRange[1])
    } else {
      fetchBills(1, pageSize)
    }
  }

  useEffect(() => {
    fetchBills(1, 10)
  }, [])

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')])
            } else {
              setDateRange(null)
            }
          }}
        />
        <Button onClick={handleSearch} type="primary">
          搜索
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={bills}
        rowKey={'id'}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page, size) => {
            setCurrentPage(page)
            setPageSize(size)
            const start = dateRange ? dateRange[0] : undefined
            const end = dateRange ? dateRange[1] : undefined
            fetchBills(page, size, start, end)
          }
        }}
        expandable={{
          expandedRowRender: (record) => BillItemsTable(record.billItems)
        }}
      />
    </>
  )
}

function BillItemsTable(record: Bills['billItems']) {
  const columns: TableProps<Bills['billItems'][number]>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: ['good', 'name'],
      key: 'name'
    },
    {
      title: 'Barcode',
      dataIndex: ['good', 'barcode'],
      key: 'barcode'
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: '总价',
      dataIndex: 'price',
      key: 'price'
    }
  ]

  return <Table columns={columns} dataSource={record} pagination={false} />
}
