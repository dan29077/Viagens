import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const ClienteForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        label="Nome"
        name="nome"
        rules={[{ required: true, message: "Digite o nome!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: "Digite o e-mail!" },
          { type: "email", message: "E-mail inválido!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Telefone"
        name="telefone"
        rules={[{ required: true, message: "Digite o telefone!" }]}
      >
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Salvar
      </Button>
    </Form>
  );
};

export default ClienteForm;
