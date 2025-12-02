import React from 'react'
import { Table, Card } from 'antd'
import ReservaDAO from '../daos/ReservaDAO'
import PacoteDAO from '../daos/PacoteDAO'


export default function RelatorioPage() {
const [data, setData] = React.useState([])


const load = async () => {
const [reservas, pacotes] = await Promise.all([ReservaDAO.findAll(), PacoteDAO.findAll()])


// Agrupar reservas por destino
const map = {}
pacotes.forEach(p => { map[p.id] = p.destino })
const agreg = {}
reservas.forEach(r => {
const destino = map[r.pacoteId] || 'Sem destino'
if (!agreg[destino]) agreg[destino] = { destino, totalReservas: 0, totalValor: 0 }
agreg[destino].totalReservas += 1
agreg[destino].totalValor += Number(r.valorPago || 0)
})


setData(Object.values(agreg))
}


React.useEffect(() => { load() }, [])


const columns = [
{ title: 'Destino', dataIndex: 'destino' },
{ title: 'Total Reservas', dataIndex: 'totalReservas' },
{ title: 'Total Valor (R$)', dataIndex: 'totalValor', render: v => `R$ ${v}` }
]


return (
<Card>
<h2>Relatório — Reservas por Destino</h2>
<Table dataSource={data} columns={columns} rowKey="destino" pagination={false} />
</Card>
)
}