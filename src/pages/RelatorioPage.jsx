import React, { useEffect, useState } from "react";
import { Table, Card, Spin } from "antd";
import RelatorioDAO from "../daos/RelatorioDAO";

export default function RelatorioPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    try {
      setDados(RelatorioDAO.reservasPorDestino());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: "Destino", dataIndex: "destino" },
    { title: "Total de Reservas", dataIndex: "totalReservas" },
    {
      title: "Total Arrecadado",
      dataIndex: "totalReceita",
      render: v => `R$ ${Number(v).toFixed(2)}`
    }
  ];

  return (
    <Card title="Relatório — Reservas por Destino">
      <Spin spinning={loading}>
        <Table rowKey="destino" dataSource={dados} columns={columns} />
      </Spin>
    </Card>
  );
}
