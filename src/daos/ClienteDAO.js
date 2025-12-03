const KEY = "viagens_clientes";
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

export default class ClienteDAO {
  static getAll() {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  }
  static getById(id) {
    return this.getAll().find(c => c.id === id) || null;
  }
  static create(cliente) {
    const lista = this.getAll();
    const novo = { ...cliente, id: genId() };
    lista.push(novo);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return novo;
  }
  static update(id, dados) {
    const lista = this.getAll();
    const idx = lista.findIndex(x => x.id === id);
    if (idx < 0) return null;
    lista[idx] = { ...lista[idx], ...dados };
    localStorage.setItem(KEY, JSON.stringify(lista));
    return lista[idx];
  }
  static delete(id) {
    const lista = this.getAll().filter(x => x.id !== id);
    localStorage.setItem(KEY, JSON.stringify(lista));
  }
}
