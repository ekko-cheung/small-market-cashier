import { Line } from '@ant-design/charts'
import { Card, Col, Row, Statistic } from 'antd'
import { useEffect, useState } from 'react'

export default function Home(): React.JSX.Element {
  const [todayBillData, setTodayBillData] = useState({
    sales: 0,
    orders: 0
  })
  const fetchTodayBillData = async () => {
    const result = await window.api.queryBillsTodaySalesNumberAndOrder()
    if (result.data && result.data.length > 0) setTodayBillData(result.data[0])
  }

  const [last7DaysData, setLast7DaysData] = useState<{ date: string; sales: number }[]>([])
  const fetchLast7DaysData = async () => {
    const result = await window.api.queryBillsLast7DaysGrouped()
    if (result.data) setLast7DaysData(result.data)
  }

  useEffect(() => {
    fetchTodayBillData()
    fetchLast7DaysData()
  }, [])

  return (
    <>
      <div>
        <Card style={{ marginBottom: '12px' }}>
          <Row gutter={6}>
            <Col span={12}>
              <Card>
                <Statistic title="今日销售额" value={todayBillData.sales ?? 0} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="今日销售单数" value={todayBillData.orders ?? 0} />
              </Card>
            </Col>
          </Row>
        </Card>

        <Card>
          <Line title={'过去7天销售额'} data={last7DaysData} xField={'date'} yField={'sales'} />
        </Card>
      </div>
    </>
  )
}
