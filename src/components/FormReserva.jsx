import React from 'react'
import { Modal, Form, Select, DatePicker, InputNumber } from 'antd'
import dayjs from 'dayjs'


export default function FormReserva({ open, onCancel, onSave, initial, clientes = [], pacotes = [] }) {
const [form] = Form.useForm()


React.useEffect(() => {
if (open) form.resetFields()
if (initial) form.setFieldsValue({
...initial,
dataReserva: initial?.dataReserva ? dayjs(initial.dataReserva) : null
})
}, [open, initial])


return (
<Modal open={open} title={initial ? 'Editar Reserva' : 'Nova Reserva'} onCancel={onCancel} onOk={() => form.submit()} okText="Salvar">
<Form form={form} layout="vertical" onFinish={(values) => onSave({
...values,
dataReserva: values.dataReserva ? values.dataReserva.format('YYYY-MM-DD') : ''
})}>
<Form.Item name="clienteId" label="Cliente" rules={[{ required: true }]}>
<Select options={clientes.map(c => ({ label: c.nome, value: c.id }))} />
</Form.Item>
<Form.Item name="pacoteId" label="Pacote" rules={[{ required: true }]}>
<Select options={pacotes.map(p => ({ label: p.destino, value: p.id }))} />
</Form.Item>
<Form.Item name="dataReserva" label="Data da Reserva" rules={[{ required: true }]}>
<DatePicker style={{ width: '100%' }} />
</Form.Item>
<Form.Item name="valorPago" label="Valor Pago" rules={[{ required: true }]}>
<InputNumber style={{ width: '100%' }} min={0} />
</Form.Item>
</Form>
</Modal>
)
}