class StorageClass {
  constructor() {
    this.store = {};
  }

  setData(property, value) {
    this.store[property] = value;
  }

  getData(property) {
    return this.store[property];
  }

  removeData(property) {
    delete this.store[property];
  }

  clearStore() {
    this.store = {};
  }

  getStore() {
    return this.store;
  }
}

const InternalStorage = new StorageClass();

export default InternalStorage;