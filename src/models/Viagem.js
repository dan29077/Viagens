import dayjs from 'dayjs';

/**
 * @typedef {Object} Viagem - Interface/Modelo de Dados para Viagens
 * @property {string} id - Identificador único da viagem.
 * @property {string} destino - Nome do destino.
 * @property {string} tipo - Tipo de viagem ('Lazer', 'Trabalho', 'Estudo', 'Aventura').
 * @property {dayjs.Dayjs} dataInicio - Data de início da viagem (objeto dayjs).
 * @property {dayjs.Dayjs} dataFim - Data de fim da viagem (objeto dayjs).
 * @property {number} precoEstimado - Preço estimado da viagem.
 * @property {string} observacoes - Observações adicionais.
 */
export const ViagemModel = {
  id: '',
  destino: '',
  tipo: 'Lazer',
  dataInicio: dayjs(),
  dataFim: dayjs().add(7, 'day'),
  precoEstimado: 0,
  observacoes: ''
};