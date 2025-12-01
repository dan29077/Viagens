import dayjs from 'dayjs';

/**
 * Data Access Object para operações de persistência de Viagens no LocalStorage.
 * Encapsula toda a lógica de acesso e manipulação do LocalStorage.
 */
class ViagemDAO {
  constructor(storageKey = 'viagens_turismo_data') {
    this.storageKey = storageKey;
    console.log(`ViagemDAO inicializado com a chave: ${this.storageKey}`);
  }

  /**
   * Carrega todas as viagens do LocalStorage, convertendo strings de data para dayjs.
   * @returns {Object[]} Lista de viagens formatadas.
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
      // O feedback visual será dado no App.jsx
    }
    return [];
  }

  /**
   * Salva ou atualiza uma viagem, convertendo objetos dayjs para strings ISO.
   * @param {Object} viagemData - Dados da viagem a ser salva.
   * @returns {Object} A viagem salva/atualizada com as datas em formato dayjs.
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
    } else {
      // Criação: Gera um ID único
      viagemParaSalvar.id = crypto.randomUUID();
      viagensNoStorage.push(viagemParaSalvar);
      localStorage.setItem(this.storageKey, JSON.stringify(viagensNoStorage));
    }

    // Retorna a viagem com o ID gerado (se for criação) e as datas dayjs (para o estado do React)
    return { ...novaViagem, id: viagemParaSalvar.id };
  }

  /**
   * Remove uma viagem pelo ID.
   * @param {string} id - ID da viagem a ser removida.
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
  }
}

// Exporta uma instância única do DAO para ser utilizada na aplicação
export const viagemDAO = new ViagemDAO();