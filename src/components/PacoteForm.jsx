import React, { useEffect } from "react";
import { Form, Input, InputNumber, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const PacoteForm = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dataIda: initialValues.dataIda ? dayjs(initialValues.dataIda) : null,
        dataVolta: initialValues.dataVolta ? dayjs(initialValues.dataVolta) : null,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      dataIda: values.dataIda.format("YYYY-MM-DD"),
      dataVolta: values.dataVolta.format("YYYY-MM-DD"),
    };

    onSubmit(formatted);
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        label="Destino"
        name="destino"
        rules={[{ required: true, message: "Informe o destino!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Preço"
        name="preco"
        rules={[{ required: true, message: "Informe o preço!" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Data de Ida"
        name="dataIda"
        rules={[{ required: true, message: "Informe a data de ida!" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Data de Volta"
        name="dataVolta"
        rules={[{ required: true, message: "Informe a data de volta!" }]}
      >
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Salvar
      </Button>
    </Form>
  );
};

export default PacoteForm;
