import React from 'react'
import { Modal, Form, Input } from 'antd'


export default function FormCliente({ open, onCancel, onSave, initial }) {
const [form] = Form.useForm()


React.useEffect(() => {
if (open) form.resetFields()
if (initial) form.setFieldsValue(initial)
}, [open, initial])


return (
<Modal open={open} title={initial ? 'Editar Cliente' : 'Novo Cliente'} onCancel={onCancel} onOk={() => form.submit()} okText="Salvar">
<Form form={form} layout="vertical" onFinish={(values) => onSave(values)}>
<Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
<Input />
</Form.Item>
<Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email inválido' }]}>
<Input />
</Form.Item>
<Form.Item name="telefone" label="Telefone" rules={[{ required: true, message: 'Informe o telefone' }]}>
<Input />
</Form.Item>
</Form>
</Modal>
)
}