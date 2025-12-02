import React from 'react'
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd'
import dayjs from 'dayjs'


export default function FormPacote({ open, onCancel, onSave, initial }) {
const [form] = Form.useForm()


React.useEffect(() => {
if (open) form.resetFields()
if (initial) {
form.setFieldsValue({
...initial,
dataIda: initial.dataIda ? dayjs(initial.dataIda) : null,
dataVolta: initial.dataVolta ? dayjs(initial.dataVolta) : null,
})
}
}, [open, initial])


return (
<Modal open={open} title={initial ? 'Editar Pacote' : 'Novo Pacote'} onCancel={onCancel} onOk={() => form.submit()} okText="Salvar">
<Form form={form} layout="vertical" onFinish={(values) => {
onSave({
...values,
dataIda: values.dataIda ? values.dataIda.format('YYYY-MM-DD') : '',
dataVolta: values.dataVolta ? values.dataVolta.format('YYYY-MM-DD') : ''
})
}}>
<Form.Item name="destino" label="Destino" rules={[{ required: true, message: 'Informe o destino' }]}>
<Input />
</Form.Item>
<Form.Item name="preco" label="Preço" rules={[{ required: true, message: 'Informe o preço' }]}>
<InputNumber style={{ width: '100%' }} min={0} />
</Form.Item>
<Form.Item name="dataIda" label="Data de Ida">
<DatePicker style={{ width: '100%' }} />
</Form.Item>
<Form.Item name="dataVolta" label="Data de Volta">
<DatePicker style={{ width: '100%' }} />
</Form.Item>
</Form>
</Modal>
)
}