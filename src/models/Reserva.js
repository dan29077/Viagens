export default class Reserva {
    constructor({ id = null, clienteId = '', pacoteId = '', dataReserva = '', valorPago = 0 } = {}) {
    this.id = id || String(Date.now())
    this.clienteId = clienteId
    this.pacoteId = pacoteId
    this.dataReserva = dataReserva
    this.valorPago = valorPago
    }
    }