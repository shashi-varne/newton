import { isFunction } from "./validators";

const eventManager = {
  eventsMapper: new Map(),

  add(event, callback) {
    this.eventsMapper.set(event, callback);
  },

  delete(event) {
    this.eventsMapper.delete(event);
  },

  emit(event, ...args) {
    if (!this.eventsMapper.has(event)) {
      return false;
    }
    const callback = this.eventsMapper.get(event);
    if (isFunction(callback)) {
      callback(...args);
    }
  },
};

export default eventManager;
