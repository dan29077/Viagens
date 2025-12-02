export default class Pacote {
  constructor({ id = null, destino = '', preco = 0, dataIda = '', dataVolta = '' } = {}) {
  this.id = id || String(Date.now())
  this.destino = destino
  this.preco = preco
  this.dataIda = dataIda
  this.dataVolta = dataVolta
  }
  }