export class Pacote {
  constructor({ id = null, destino = "", preco = 0, dataIda = null, dataVolta = null } = {}) {
    this.id = id;
    this.destino = destino;
    this.preco = preco;
    this.dataIda = dataIda;
    this.dataVolta = dataVolta;
  }
}
