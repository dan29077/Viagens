import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import LayoutMenu from "./components/LayoutMenu";
import ClientesPage from "./pages/ClientesPage";
import PacotesPage from "./pages/PacotesPage";
import ReservasPage from "./pages/ReservasPage";
import RelatorioPage from "./pages/RelatorioPage";

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", padding: 0 }}>
        <LayoutMenu />
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/pacotes" replace />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/pacotes" element={<PacotesPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/relatorio" element={<RelatorioPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}
