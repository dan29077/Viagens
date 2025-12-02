import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Popconfirm } from "antd";
import ReservaDAO from "../daos/ReservaDAO";
import Reserva from "../models/Reserva";
import ClienteDAO from "../daos/ClienteDAO";
import PacoteDAO from "../daos/PacoteDAO";
import FormReserva from "../components/FormReserva";

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setClientes(await ClienteDAO.getAll());
    setPacotes(await PacoteDAO.getAll());
    setReservas(await ReservaDAO.getAll());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (values) => {
    try {
      if (editing) {
        await ReservaDAO.update(editing.id, values);
        message.success("Reserva atualizada");
      } else {
        const r = new Reserva(values);
        await ReservaDAO.save(r);
        message.success("Reserva criada");
      }
      setOpenForm(false);
      setEditing(null);
      load();
    } catch (e) {
      message.error("Erro ao salvar");
    }
  };

  const handleDelete = async (id) => {
    await ReservaDAO.delete(id);
    message.success("Reserva removida");
    load();
  };

  const columns = [
    {
      title: "Cliente",
      dataIndex: "clienteId",
      render: (id) => clientes.find((c) => c.id === id)?.nome || "—",
    },
    {
      title: "Destino",
      dataIndex: "pacoteId",
      render: (id) => pacotes.find((p) => p.id === id)?.destino || "—",
    },
    { title: "Data da Reserva", dataIndex: "dataReserva" },
    { title: "Valor Pago", dataIndex: "valorPago" },
    {
      title: "Ações",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => { setEditing(record); setOpenForm(true); }}>
            Editar
          </Button>

          <Popconfirm title="Excluir?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setOpenForm(true)}>
          Nova Reserva
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={reservas}
        columns={columns}
        loading={loading}
      />

      <FormReserva
        open={openForm}
        onCancel={() => { setOpenForm(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
        clientes={clientes}
        pacotes={pacotes}
      />
    </div>
  );
}
