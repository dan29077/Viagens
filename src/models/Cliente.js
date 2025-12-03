export class Cliente {
    constructor({ id = null, nome = "", email = "", telefone = "" } = {}) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
    }
  }
  