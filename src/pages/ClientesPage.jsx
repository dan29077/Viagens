import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Spin } from "antd";
import ClienteDAO from "../daos/ClienteDAO";

export default function ClientesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    try {
      setList(ClienteDAO.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  }

  function openEdit(record) {
    setEditing(record);
    form.setFieldsValue({
      nome: record.nome,
      email: record.email,
      telefone: record.telefone
    });
    setModalVisible(true);
  }

  async function onFinish(values) {
    try {
      if (editing) {
        ClienteDAO.update(editing.id, values);
        message.success("Cliente atualizado com sucesso");
      } else {
        ClienteDAO.create(values);
        message.success("Cliente cadastrado");
      }
      setModalVisible(false);
      load();
    } catch (err) {
      message.error("Erro ao salvar cliente");
    }
  }

  function doDelete(id) {
    Modal.confirm({
      title: "Confirma exclusão?",
      onOk: () => {
        ClienteDAO.delete(id);
        load();
        message.success("Excluído");
      }
    });
  }

  const columns = [
    { title: "Nome", dataIndex: "nome" },
    { title: "Email", dataIndex: "email" },
    { title: "Telefone", dataIndex: "telefone" },
    {
      title: "Ações",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Editar</Button>
          <Button danger onClick={() => doDelete(record.id)}>Excluir</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          Novo Cliente
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table rowKey="id" dataSource={list} columns={columns} />
      </Spin>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title={editing ? "Editar Cliente" : "Novo Cliente"}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: "Informe o nome" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: "Informe o e-mail" },
              { type: "email", message: "Email inválido" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telefone"
            label="Telefone"
            rules={[{ required: true, message: "Informe o telefone" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Salvar</Button>
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
