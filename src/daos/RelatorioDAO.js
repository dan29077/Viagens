import ReservaDAO from "./ReservaDAO";
import PacoteDAO from "./PacoteDAO";

export default class RelatorioDAO {
  static reservasPorDestino() {
    const reservas = ReservaDAO.getAll();
    const pacotes = PacoteDAO.getAll();
    const map = {}; // destino -> { totalReservas, totalReceita }

    reservas.forEach(r => {
      const pac = pacotes.find(p => p.id === r.pacoteId);
      if (!pac) return;
      const destino = pac.destino || "Sem destino";
      if (!map[destino]) map[destino] = { totalReservas: 0, totalReceita: 0 };
      map[destino].totalReservas += 1;
      map[destino].totalReceita += Number(r.valorPago || 0);
    });

    // transforma em array ordenado
    return Object.entries(map).map(([destino, data]) => ({ destino, ...data }))
           .sort((a,b) => b.totalReservas - a.totalReservas);
  }
}
