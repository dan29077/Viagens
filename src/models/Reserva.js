export class Reserva {
    constructor({ id = null, clienteId = null, pacoteId = null, dataReserva = null, valorPago = 0 } = {}) {
      this.id = id;
      this.clienteId = clienteId;
      this.pacoteId = pacoteId;
      this.dataReserva = dataReserva;
      this.valorPago = valorPago;
    }
  }
  