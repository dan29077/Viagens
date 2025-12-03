import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

export default function LayoutMenu() {
  const location = useLocation();
  const selectedKey = location.pathname;
  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ lineHeight: "64px" }}>
      <Menu.Item key="/pacotes"><Link to="/pacotes">Pacotes</Link></Menu.Item>
      <Menu.Item key="/clientes"><Link to="/clientes">Clientes</Link></Menu.Item>
      <Menu.Item key="/reservas"><Link to="/reservas">Reservas</Link></Menu.Item>
      <Menu.Item key="/relatorio"><Link to="/relatorio">Relatório</Link></Menu.Item>
    </Menu>
  );
}
