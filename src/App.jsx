import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import PacotesPage from './pages/PacotesPage'
import ClientesPage from './pages/ClientesPage'
import ReservasPage from './pages/ReservasPage'
import RelatorioPage from './pages/RelatorioPage'


const { Header, Content } = Layout


export default function App() {
const location = useLocation()
return (
<Layout>
<Header>
<div style={{ float: 'left', color: 'white', fontWeight: 700, marginRight: 24 }}>Viagens</div>
<Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
<Menu.Item key="/pacotes"><Link to="/pacotes">Pacotes</Link></Menu.Item>
<Menu.Item key="/clientes"><Link to="/clientes">Clientes</Link></Menu.Item>
<Menu.Item key="/reservas"><Link to="/reservas">Reservas</Link></Menu.Item>
<Menu.Item key="/relatorio"><Link to="/relatorio">Relatório</Link></Menu.Item>
</Menu>
</Header>
<Content style={{ padding: '24px' }}>
<div className="site-layout-content">
<Routes>
<Route path="/" element={<PacotesPage />} />
<Route path="/pacotes" element={<PacotesPage />} />
<Route path="/clientes" element={<ClientesPage />} />
<Route path="/reservas" element={<ReservasPage />} />
<Route path="/relatorio" element={<RelatorioPage />} />
</Routes>
</div>
</Content>
</Layout>
)
}