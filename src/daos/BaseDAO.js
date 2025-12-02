// BaseDAO para encapsular operações comuns sobre LocalStorage
export default class BaseDAO {
  constructor(storageKey) {
  this.storageKey = storageKey
  }
  
  
  _readAll() {
  const raw = localStorage.getItem(this.storageKey)
  return raw ? JSON.parse(raw) : []
  }
  
  
  _writeAll(items) {
  localStorage.setItem(this.storageKey, JSON.stringify(items))
  }
  
  
  findAll() {
  return Promise.resolve(this._readAll())
  }
  
  
  findById(id) {
  const item = this._readAll().find(i => i.id === id)
  return Promise.resolve(item || null)
  }
  
  
  save(item) {
  const items = this._readAll()
  items.push(item)
  this._writeAll(items)
  return Promise.resolve(item)
  }
  
  
  update(id, updated) {
  const items = this._readAll()
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return Promise.resolve(null)
  items[idx] = { ...items[idx], ...updated }
  this._writeAll(items)
  return Promise.resolve(items[idx])
  }
  
  
  delete(id) {
  const items = this._readAll().filter(i => i.id !== id)
  this._writeAll(items)
  return Promise.resolve()
  }
  }