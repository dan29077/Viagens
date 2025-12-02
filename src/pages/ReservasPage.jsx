import React from 'react'
const [pacotes, setPacotes] = React.useState([])
const [loading, setLoading] = React.useState(false)
const [openForm, setOpenForm] = React.useState(false)
const [editing, setEditing] = React.useState(null)


const load = async () => {
setLoading(true)
const [r, c, p] = await Promise.all([ReservaDAO.findAll(), ClienteDAO.findAll(), PacoteDAO.findAll()])
setReservas(r); setClientes(c); setPacotes(p); setLoading(false)
}


React.useEffect(() => { load() }, [])


const handleSave = async (values) => {
try {
if (editing) {
await ReservaDAO.update(editing.id, values)
message.success('Reserva atualizada')
} else {
const r = new Reserva(values)
await ReservaDAO.save(r)
message.success('Reserva criada')
}
setOpenForm(false); setEditing(null); load()
} catch (e) { message.error('Erro ao salvar') }
}


const handleDelete = async (id) => { await ReservaDAO.delete(id); message.success('Removido'); load() }


const columns = [
{ title: 'Cliente', dataIndex: 'clienteId', render: id => (clientes.find(c=>c.id===id)?.nome || '-') },
{ title: 'Destino', dataIndex: 'pacoteId', render: id => (pacotes.find(p=>p.id===id)?.destino || '-') },
{ title: 'Data Reserva', dataIndex: 'dataReserva' },
{ title: 'Valor Pago', dataIndex: 'valorPago', render: v => `R$ ${v}` },
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
<Button type="primary" onClick={() => setOpenForm(true)}>Nova Reserva</Button>
</Space>
<Table rowKey="id" dataSource={reservas} columns={columns} loading={loading} />


<FormReserva open={openForm} onCancel={() => { setOpenForm(false); setEditing(null) }} onSave={handleSave} initial={editing} clientes={clientes} pacotes={pacotes} />
</div>
)