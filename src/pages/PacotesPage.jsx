import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Popconfirm } from "antd";
import PacoteDAO from "../daos/PacoteDAO";
import Pacote from "../models/Pacote";
import FormPacote from "../components/FormPacote";

export default function PacotesPage() {
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await PacoteDAO.getAll();
    setPacotes(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (values) => {
    try {
      if (editing) {
        await PacoteDAO.update(editing.id, values);
        message.success("Pacote atualizado");
      } else {
        const p = new Pacote(values);
        await PacoteDAO.save(p);
        message.success("Pacote criado");
      }
      setOpenForm(false);
      setEditing(null);
      load();
    } catch (e) {
      message.error("Erro ao salvar");
    }
  };

  const handleDelete = async (id) => {
    await PacoteDAO.delete(id);
    message.success("Pacote removido");
    load();
  };

  const columns = [
    { title: "Destino", dataIndex: "destino" },
    { title: "Preço", dataIndex: "preco" },
    { title: "Data Ida", dataIndex: "dataIda" },
    { title: "Data Volta", dataIndex: "dataVolta" },
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
          Novo Pacote
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={pacotes}
        columns={columns}
        loading={loading}
      />

      <FormPacote
        open={openForm}
        onCancel={() => { setOpenForm(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
