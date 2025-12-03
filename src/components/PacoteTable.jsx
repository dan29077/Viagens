import React from "react";
import { Table, Button, Popconfirm } from "antd";

const PacoteTable = ({ data, onEdit, onDelete }) => {
  const columns = [
    { title: "Destino", dataIndex: "destino" },
    { title: "Preço", dataIndex: "preco" },
    { title: "Data de Ida", dataIndex: "dataIda" },
    { title: "Data de Volta", dataIndex: "dataVolta" },
    {
      title: "Ações",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Editar
          </Button>

          <Popconfirm
            title="Excluir pacote?"
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

export default PacoteTable;
