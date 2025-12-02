export default class Cliente {
    constructor({ id = null, nome = '', email = '', telefone = '' } = {}) {
    this.id = id || String(Date.now())
    this.nome = nome
    this.email = email
    this.telefone = telefone
    }
    }