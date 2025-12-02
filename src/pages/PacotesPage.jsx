import React from 'react'
const handleSave = async (values) => {
try {
if (editing) {
await PacoteDAO.update(editing.id, values)
message.success('Pacote atualizado')
} else {
const p = new Pacote(values)
await PacoteDAO.save(p)
message.success('Pacote criado')
}
setOpenForm(false)
setEditing(null)
load()
} catch (e) { message.error('Erro ao salvar') }
}


const handleDelete = async (id) => {
await PacoteDAO.delete(id)
message.success('Pacote removido')
load()
}


const columns = [
{ title: 'Destino', dataIndex: 'destino' },
{ title: 'Preço', dataIndex: 'preco', render: (v) => `R$ ${v}` },
{ title: 'Data Ida', dataIndex: 'dataIda' },
{ title: 'Data Volta', dataIndex: 'dataVolta' },
{
title: 'Ações', key: 'acoes', render: (_, record) => (
<Space>
<Button onClick={() => { setEditing(record); setOpenForm(true) }}>Editar</Button>
<Popconfirm title="Confirmar?" onConfirm={() => handleDelete(record.id)}>
<Button danger>Excluir</Button>
</Popconfirm>
</Space>
)
}
]


return (
<div>
<Space style={{ marginBottom: 16 }}>
<Button type="primary" onClick={() => setOpenForm(true)}>Novo Pacote</Button>
</Space>
<Table rowKey="id" dataSource={pacotes} columns={columns} loading={loading} />


<FormPacote open={openForm} onCancel={() => { setOpenForm(false); setEditing(null) }} onSave={handleSave} initial={editing} />
</div>
)