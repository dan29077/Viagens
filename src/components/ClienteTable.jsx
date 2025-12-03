import React from "react";
import { Table, Button, Popconfirm } from "antd";

const ClienteTable = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
    },
    {
      title: "Ações",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>

          <Popconfirm
            title="Excluir cliente?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger type="link">
              Excluir
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default ClienteTable;
