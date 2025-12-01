import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Table, Button, Form, Input, DatePicker, Select, Card, Modal, message, Space, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

const { Header, Content, Footer } = Layout;
const { Option } = Select;

// ===========================================================
// CONTEÚDO DE: src/models/Viagem.js (Consolidado)
// ===========================================================

/**
 * Interface/Modelo de Dados para Viagens
 */
const ViagemModel = {
  id: '',
  destino: '',
  tipo: 'Lazer',
  dataInicio: dayjs(),
  dataFim: dayjs().add(7, 'day'),
  precoEstimado: 0,
  observacoes: ''
};

// ===========================================================
// CONTEÚDO DE: src/daos/ViagemDAO.js (Consolidado)
// ===========================================================

/**
 * Data Access Object para operações de persistência de Viagens no LocalStorage.
 * Encapsula toda a lógica de acesso e manipulação do LocalStorage.
 */
class ViagemDAO {
  constructor(storageKey = 'viagens_turismo_data') {
    this.storageKey = storageKey;
  }

  /**
   * Carrega todas as viagens do LocalStorage, convertendo strings de data para dayjs.
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const viagensRaw = JSON.parse(data);
        return viagensRaw.map(v => ({
          ...v,
          // Garante que as datas sejam objetos dayjs para o estado do React
          dataInicio: dayjs(v.dataInicio),
          dataFim: dayjs(v.dataFim),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do LocalStorage:', error);
    }
    return [];
  }

  /**
   * Salva ou atualiza uma viagem, convertendo objetos dayjs para strings ISO.
   */
  save(viagemData) {
    let viagens = this.getAll();
    let novaViagem = { ...viagemData };

    // Converte dayjs para string ISO antes de salvar no LocalStorage
    const viagemParaSalvar = {
      ...novaViagem,
      dataInicio: novaViagem.dataInicio.toISOString(),
      dataFim: novaViagem.dataFim.toISOString(),
    };

    // Pega a lista de viagens, mas com as datas prontas para persistência (strings)
    const viagensNoStorage = viagens.map(v => ({ ...v, dataInicio: v.dataInicio.toISOString(), dataFim: v.dataFim.toISOString() }));
    
    if (viagemParaSalvar.id) {
      // Atualização
      const updatedList = viagensNoStorage.map(v => v.id === viagemParaSalvar.id ? viagemParaSalvar : v);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedList));
      message.success(`Viagem para ${novaViagem.destino} atualizada com sucesso!`);
    } else {
      // Criação: Gera um ID único
      viagemParaSalvar.id = crypto.randomUUID();
      viagensNoStorage.push(viagemParaSalvar);
      localStorage.setItem(this.storageKey, JSON.stringify(viagensNoStorage));
      message.success(`Nova viagem para ${novaViagem.destino} cadastrada!`);
    }

    // Retorna a viagem com o ID gerado (se for criação) e as datas dayjs (para o estado do React)
    return { ...novaViagem, id: viagemParaSalvar.id };
  }

  /**
   * Remove uma viagem pelo ID.
   */
  delete(id) {
    let viagens = this.getAll();
    const viagensAtualizadas = viagens.filter(v => v.id !== id);
    // Salva no LocalStorage (strings ISO)
    const viagensParaStorage = viagensAtualizadas.map(v => ({
      ...v,
      dataInicio: v.dataInicio.toISOString(),
      dataFim: v.dataFim.toISOString(),
    }));

    localStorage.setItem(this.storageKey, JSON.stringify(viagensParaStorage));
    message.success('Viagem removida com sucesso!');
  }
}

// Inicializa a instância única do DAO
const viagemDAO = new ViagemDAO();

// ===========================================================
// CONTEÚDO DE: src/components/TipoViagemTag.jsx (Consolidado e Corrigido)
// ===========================================================

/**
 * Componente funcional para exibir o tipo de viagem como uma tag colorida.
 * Inclui verificação de tipo para prevenir o erro 'toUpperCase'.
 */
const TipoViagemTag = ({ tipo }) => {
  // Verificação de segurança: se 'tipo' não for uma string válida, retorna um valor padrão.
  if (!tipo || typeof tipo !== 'string') {
    return <Tag>INDEFINIDO</Tag>; 
  }

  let color;
  switch (tipo) {
    case 'Lazer':
      color = 'blue';
      break;
    case 'Trabalho':
      color = 'geekblue';
      break;
    case 'Estudo':
      color = 'volcano';
      break;
    case 'Aventura':
      color = 'green';
      break;
    default:
      color = 'default';
  }
  return <Tag color={color}>{tipo.toUpperCase()}</Tag>;
};

// ===========================================================
// Componente Principal (App)
// ===========================================================

/**
 * Componente principal da aplicação de Viagens e Turismo.
 * Implementa a lógica CRUD, gerenciamento de estado e a UI.
 */
const App = () => {
  // Estado principal para armazenar a lista de viagens
  const [viagens, setViagens] = useState([]);
  // Estado para controlar a visibilidade do modal de cadastro/edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para armazenar os dados da viagem que está sendo editada
  const [viagemEditando, setViagemEditando] = useState(null);
  // Referência ao formulário AntD
  const [form] = Form.useForm();


  // Efeito para carregar as viagens do LocalStorage ao montar o componente
  useEffect(() => {
    carregarViagens();
  }, []);

  /**
   * Carrega os dados usando o DAO e atualiza o estado.
   */
  const carregarViagens = () => {
    const data = viagemDAO.getAll();
    setViagens(data);
  };

  /**
   * Abre o modal para cadastro de nova viagem.
   */
  const handleAdicionarViagem = () => {
    setViagemEditando(null);
    form.resetFields();
    // Valores iniciais para evitar erros de RangePicker
    form.setFieldsValue({
      tipo: 'Lazer',
      data: [dayjs(), dayjs().add(7, 'day')]
    });
    setIsModalOpen(true);
  };

  /**
   * Abre o modal para edição de uma viagem existente.
   */
  const handleEditarViagem = (viagem) => {
    setViagemEditando(viagem);
    // Popula o formulário com os dados da viagem (incluindo objetos dayjs)
    form.setFieldsValue({
      ...viagem,
      data: [viagem.dataInicio, viagem.dataFim],
    });
    setIsModalOpen(true);
  };

  /**
   * Remove uma viagem.
   */
  const handleRemoverViagem = (id) => {
    viagemDAO.delete(id);
    setViagens(viagens.filter(v => v.id !== id));
  };

  /**
   * Trata o envio do formulário (cadastro ou edição).
   */
  const handleFormSubmit = (values) => {
    const [dataInicio, dataFim] = values.data;

    // Constrói o objeto de viagem, preservando o ID se for edição
    const novaViagem = {
      ...ViagemModel,
      id: viagemEditando ? viagemEditando.id : undefined,
      destino: values.destino,
      tipo: values.tipo,
      dataInicio: dataInicio,
      dataFim: dataFim,
      precoEstimado: parseFloat(values.precoEstimado),
      observacoes: values.observacoes || '',
    };

    // Persiste os dados via DAO e recebe o objeto atualizado (com ID se for novo)
    const viagemSalva = viagemDAO.save(novaViagem);

    // Atualiza o estado da lista de viagens
    if (viagemEditando) {
      setViagens(viagens.map(v => (v.id === viagemSalva.id ? viagemSalva : v)));
    } else {
      setViagens([...viagens, viagemSalva]);
    }

    setIsModalOpen(false); // Fecha o modal
    form.resetFields(); // Limpa o formulário
    setViagemEditando(null);
  };

  /**
   * Configuração das colunas da tabela AntD (Responsiva).
   */
  const columns = [
    {
      title: 'Destino',
      dataIndex: 'destino',
      key: 'destino',
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <strong>{text}</strong>
        </Space>
      ),
      responsive: ['sm'], // Visível em telas médias e maiores
    },
    {
      title: 'Período',
      key: 'periodo',
      render: (_, record) => (
        <Space>
          <CalendarOutlined style={{ color: '#52c41a' }} />
          {record.dataInicio.format('DD/MM/YYYY')} - {record.dataFim.format('DD/MM/YYYY')}
        </Space>
      ),
      responsive: ['md'],
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      // Usa o componente TipoViagemTag, agora definido no topo do arquivo
      render: (tipo) => <TipoViagemTag tipo={tipo} />,
      responsive: ['sm'],
    },
    {
      title: 'Preço Estimado',
      dataIndex: 'precoEstimado',
      key: 'precoEstimado',
      render: (preco) => (
        <Space>
          <DollarOutlined style={{ color: '#faad14' }} />
          {preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Space>
      ),
      responsive: ['md'],
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditarViagem(record)}
            title="Editar Viagem"
          />
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: 'Confirmar Remoção',
                content: `Tem certeza que deseja remover a viagem para ${record.destino}?`,
                okText: 'Sim, Remover',
                cancelText: 'Cancelar',
                onOk: () => handleRemoverViagem(record.id),
              })
            }
            title="Remover Viagem"
          />
        </Space>
      ),
    },
  ];

  // Componente de Formulário (interno para encapsulamento)
  const ViagemForm = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        // initialValues com valores padrão para evitar avisos em edição
        initialValues={{ tipo: ViagemModel.tipo, precoEstimado: 0 }}
      >
        {/* Campo de Destino com validação */}
        <Form.Item
          name="destino"
          label="Destino"
          rules={[
            { required: true, message: 'Por favor, insira o destino!' },
            { min: 3, message: 'O destino deve ter pelo menos 3 caracteres.' }
          ]}
        >
          <Input prefix={<EnvironmentOutlined />} placeholder="Ex: Paris, França" />
        </Form.Item>

        {/* Campo de Tipo de Viagem */}
        <Form.Item
          name="tipo"
          label="Tipo de Viagem"
          rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}
        >
          <Select placeholder="Selecione o tipo">
            <Option value="Lazer">Lazer</Option>
            <Option value="Trabalho">Trabalho</Option>
            <Option value="Estudo">Estudo</Option>
            <Option value="Aventura">Aventura</Option>
          </Select>
        </Form.Item>

        {/* Campo de Período (RangePicker) */}
        <Form.Item
          name="data"
          label="Período da Viagem"
          rules={[{ required: true, message: 'Por favor, selecione as datas de início e fim!' }]}
        >
          <DatePicker.RangePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            placeholder={['Início', 'Fim']}
          />
        </Form.Item>

        {/* Campo de Preço Estimado com validação numérica */}
        <Form.Item
          name="precoEstimado"
          label="Preço Estimado (R$)"
          rules={[
            { required: true, message: 'Por favor, insira o preço estimado!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                // Permite 0 ou número positivo
                if (!value || (parseFloat(value) >= 0 && !isNaN(value))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Insira um valor numérico positivo ou zero.'));
              },
            }),
          ]}
        >
          <Input
            prefix={<DollarOutlined />}
            placeholder="Ex: 5000.50"
            // Garante que apenas números e ponto decimal possam ser digitados
            onChange={(e) => {
              const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
              form.setFieldsValue({ precoEstimado: cleanedValue });
            }}
          />
        </Form.Item>

        {/* Campo de Observações */}
        <Form.Item
          name="observacoes"
          label="Observações"
        >
          <Input.TextArea rows={2} placeholder="Detalhes importantes sobre a viagem..." />
        </Form.Item>

        {/* Botão de Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {viagemEditando ? 'Salvar Alterações' : 'Cadastrar Viagem'}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header da Aplicação */}
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <div style={{ float: 'left', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          Travel Planner Pro
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key="1">Minhas Viagens</Menu.Item>
        </Menu>
      </Header>

      {/* Conteúdo Principal */}
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Card
          title="Minhas Viagens Cadastradas"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdicionarViagem}>
              Adicionar Nova Viagem
            </Button>
          }
          // Estilização para centralizar e dar um visual agradável
          style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Tabela de Viagens */}
          <Table
            columns={columns}
            dataSource={viagens.map(v => ({ ...v, key: v.id }))} // 'key' é obrigatório para o AntD
            locale={{ emptyText: 'Nenhuma viagem cadastrada. Comece adicionando uma!' }}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }} // Garante scroll horizontal em telas pequenas
            bordered
          />
        </Card>
      </Content>

      {/* Footer da Aplicação */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#fff', borderTop: '1px solid #e8e8e8' }}>
        Travel Planner Pro ©{new Date().getFullYear()} Desenvolvido com ReactJS e Ant Design.
      </Footer>

      {/* Modal de Cadastro/Edição de Viagem */}
      <Modal
        title={viagemEditando ? 'Editar Viagem' : 'Cadastrar Nova Viagem'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setViagemEditando(null);
          form.resetFields();
        }}
        footer={null} // O botão de submit está dentro do formulário
        centered
      >
        <ViagemForm />
      </Modal>
    </Layout>
  );
};

export default App;