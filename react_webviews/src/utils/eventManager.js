import isFunction from 'lodash/isFunction';

const eventManager = {
  eventsMapper: new Map(),

  add(event, value) {
    this.eventsMapper.set(event, value);
  },

  get(event) {
    return this.eventsMapper.get(event);
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
