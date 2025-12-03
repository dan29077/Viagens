import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, message, Space, Spin } from "antd";
import PacoteDAO from "../daos/PacoteDAO";
import dayjs from "dayjs";

export default function PacotesPage(){
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    try {
      setList(PacoteDAO.getAll());
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  function openCreate(){
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  }

  function openEdit(record){
    setEditing(record);
    form.setFieldsValue({
      destino: record.destino,
      preco: record.preco,
      dataIda: record.dataIda ? dayjs(record.dataIda) : null,
      dataVolta: record.dataVolta ? dayjs(record.dataVolta) : null
    });
    setModalVisible(true);
  }

  async function onFinish(values){
    try {
      const payload = {
        destino: values.destino,
        preco: values.preco,
        dataIda: values.dataIda?.toISOString(),
        dataVolta: values.dataVolta?.toISOString()
      };
      if (editing) {
        PacoteDAO.update(editing.id, payload);
        message.success("Pacote atualizado");
      } else {
        PacoteDAO.create(payload);
        message.success("Pacote criado");
      }
      setModalVisible(false);
      load();
    } catch (err){
      message.error("Erro ao salvar");
    }
  }

  function doDelete(id){
    Modal.confirm({
      title: "Confirma exclusão?",
      onOk: () => {
        PacoteDAO.delete(id);
        load();
        message.success("Excluído");
      }
    });
  }

  const columns = [
    { title: "Destino", dataIndex: "destino", key: "destino" },
    { title: "Preço", dataIndex: "preco", key: "preco", render: v => `R$ ${Number(v).toFixed(2)}` },
    { title: "Ida", dataIndex: "dataIda", key: "dataIda", render: d => d ? dayjs(d).format("DD/MM/YYYY") : "" },
    { title: "Volta", dataIndex: "dataVolta", key: "dataVolta", render: d => d ? dayjs(d).format("DD/MM/YYYY") : "" },
    { title: "Ações", key: "acoes", render: (_, record) => (
      <Space>
        <Button onClick={() => openEdit(record)}>Editar</Button>
        <Button danger onClick={() => doDelete(record.id)}>Excluir</Button>
      </Space>
    ) }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>Novo Pacote</Button>
      </Space>
      <Spin spinning={loading}>
        <Table dataSource={list} columns={columns} rowKey="id" />
      </Spin>

      <Modal open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} title={editing ? "Editar Pacote" : "Novo Pacote"}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="destino" label="Destino" rules={[{ required: true, message: "Informe o destino" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="preco" label="Preço (R$)" rules={[{ required: true, message: "Informe o preço" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="dataIda" label="Data de Ida">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="dataVolta" label="Data de Volta">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">Salvar</Button>
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
