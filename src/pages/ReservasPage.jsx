import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  message,
  Space,
  Spin
} from "antd";
import ReservaDAO from "../daos/ReservaDAO";
import ClienteDAO from "../daos/ClienteDAO";
import PacoteDAO from "../daos/PacoteDAO";
import dayjs from "dayjs";

export default function ReservasPage() {
  const [list, setList] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    try {
      setList(ReservaDAO.getAll());
      setClientes(ClienteDAO.getAll());
      setPacotes(PacoteDAO.getAll());
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
      clienteId: record.clienteId,
      pacoteId: record.pacoteId,
      valorPago: Number(record.valorPago),
      dataReserva: record.dataReserva ? dayjs(record.dataReserva) : null
    });
    setModalVisible(true);
  }

  function onFinish(values) {
    try {
      const payload = {
        clienteId: values.clienteId,
        pacoteId: values.pacoteId,
        valorPago: values.valorPago,
        dataReserva: values.dataReserva?.toISOString()
      };

      if (editing) {
        ReservaDAO.update(editing.id, payload);
        message.success("Reserva atualizada");
      } else {
        ReservaDAO.create(payload);
        message.success("Reserva criada");
      }

      setModalVisible(false);
      load();
    } catch (e) {
      message.error("Erro ao salvar reserva");
    }
  }

  function doDelete(id) {
    Modal.confirm({
      title: "Confirma exclusão?",
      onOk: () => {
        ReservaDAO.delete(id);
        load();
        message.success("Excluído");
      }
    });
  }

  const columns = [
    {
      title: "Cliente",
      dataIndex: "clienteId",
      render: id => clientes.find(c => c.id === id)?.nome || "—"
    },
    {
      title: "Pacote",
      dataIndex: "pacoteId",
      render: id => pacotes.find(p => p.id === id)?.destino || "—"
    },
    {
      title: "Data da Reserva",
      dataIndex: "dataReserva",
      render: d => (d ? dayjs(d).format("DD/MM/YYYY") : "")
    },
    {
      title: "Valor Pago",
      dataIndex: "valorPago",
      render: v => `R$ ${Number(v).toFixed(2)}`
    },
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
          Nova Reserva
        </Button>
      </Space>
      <Spin spinning={loading}>
        <Table rowKey="id" dataSource={list} columns={columns} />
      </Spin>

      {/* Formulário */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title={editing ? "Editar Reserva" : "Nova Reserva"}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="clienteId"
            label="Cliente"
            rules={[{ required: true, message: "Selecione o cliente" }]}
          >
            <Select placeholder="Escolha um cliente">
              {clientes.map(c => (
                <Select.Option key={c.id} value={c.id}>
                  {c.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="pacoteId"
            label="Pacote"
            rules={[{ required: true, message: "Selecione o pacote" }]}
          >
            <Select placeholder="Escolha um pacote">
              {pacotes.map(p => (
                <Select.Option key={p.id} value={p.id}>
                  {p.destino}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dataReserva"
            label="Data da Reserva"
            rules={[{ required: true, message: "Selecione a data" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="valorPago"
            label="Valor Pago"
            rules={[{ required: true, message: "Informe o valor pago" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Salvar
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
