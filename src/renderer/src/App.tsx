import { Layout, Menu, theme } from 'antd'
import { Header, Content } from 'antd/es/layout/layout'
import { Outlet, useLocation, useNavigate } from 'react-router'

const { Sider } = Layout

const items = [
  { key: '/', label: '主页' },
  { key: '/goods', label: '商品管理' },
  { key: '/front_desk_sales', label: '前台销售' },
  { key: '/payments', label: '支付方式' },
  { key: '/bills', label: '账单' }
]

function App(): React.JSX.Element {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const location = useLocation()
  const navigate = useNavigate()

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout>
      <Sider breakpoint="sm" collapsedWidth="0">
        <h2 style={{ color: 'white', textAlign: 'center' }}>Supermarket Cashier</h2>
        <Menu
          selectedKeys={[location.pathname]}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
