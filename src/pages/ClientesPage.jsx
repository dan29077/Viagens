import React from 'react'
import { Table, Button, Space, Popconfirm, message } from 'antd'
import ClienteDAO from '../daos/ClienteDAO'
import Cliente from '../models/Cliente'
import FormCliente from '../components/FormCliente'


export default function ClientesPage() {
const [clientes, setClientes] = React.useState([])
const [loading, setLoading] = React.useState(false)
const [openForm, setOpenForm] = React.useState(false)
const [editing, setEditing] = React.useState(null)


const load = async () => { setLoading(true); setClientes(await ClienteDAO.findAll()); setLoading(false) }
React.useEffect(() => { load() }, [])


const handleSave = async (values) => {
try {
if (editing) {
await ClienteDAO.update(editing.id, values)
message.success('Cliente atualizado')
} else {
const c = new Cliente(values)
await ClienteDAO.save(c)
message.success('Cliente criado')
}
setOpenForm(false); setEditing(null); load()
} catch (e) { message.error('Erro ao salvar') }
}


const handleDelete = async (id) => { await ClienteDAO.delete(id); message.success('Cliente removido'); load() }


const columns = [
{ title: 'Nome', dataIndex: 'nome' },
{ title: 'Email', dataIndex: 'email' },
{ title: 'Telefone', dataIndex: 'telefone' },
{ title: 'Ações', key: 'acoes', render: (_, record) => (
<Space>
<Button onClick={() => { setEditing(record); setOpenForm(true) }}>Editar</Button>
<Popconfirm title="Confirmar?" onConfirm={() => handleDelete(record.id)}>
<Button danger>Excluir</Button>
</Popconfirm>
</Space>
) }
]


return (
<div>
<Space style={{ marginBottom: 16 }}>
<Button type="primary" onClick={() => setOpenForm(true)}>Novo Cliente</Button>
</Space>
<Table rowKey="id" dataSource={clientes} columns={columns} loading={loading} />


<FormCliente open={openForm} onCancel={() => { setOpenForm(false); setEditing(null) }} onSave={handleSave} initial={editing} />
</div>
)
}