import React from 'react';
import { Tag } from 'antd';

/**
 * Componente funcional para exibir o tipo de viagem como uma tag colorida.
 * Inclui verificação de tipo para prevenir o erro 'toUpperCase'.
 * @param {Object} props - As propriedades do componente.
 * @param {string} props.tipo - O tipo de viagem (e.g., 'Lazer', 'Trabalho').
 */
const TipoViagemTag = ({ tipo }) => {
  // Verificação de segurança: se 'tipo' não for uma string válida, retorna um valor padrão.
  if (!tipo || typeof tipo !== 'string') {
    return <Tag>Indefinido</Tag>; 
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

export default TipoViagemTag;