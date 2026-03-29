import { Button, Drawer, Form, Input, InputNumber, notification } from 'antd'

export default function CreateGoodsDrawer(props: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()

  const submitForm = async (values) => {
    const resp = await window.api.createGoods(values)
    if (resp.message)
      notification.error({ title: '创建失败', description: resp.message, placement: 'top' })
    else {
      form.resetFields()
      notification.success({ title: '创建成功', placement: 'top' })
      form.focusField('name')
    }
  }

  return (
    <Drawer title="创建商品" open={props.open} onClose={props.onClose}>
      <Form form={form} onFinish={submitForm} labelCol={{ span: 6 }}>
        <Form.Item label="商品名称" name="name">
          <Input onPressEnter={() => form.focusField('barcode')} />
        </Form.Item>
        <Form.Item
          label="一维码"
          name="barcode"
          rules={[{ required: true, message: 'please input' }]}
        >
          <Input onPressEnter={() => form.focusField('price')} />
        </Form.Item>
        <Form.Item label="价格" name="price" rules={[{ required: true, message: 'please input' }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
