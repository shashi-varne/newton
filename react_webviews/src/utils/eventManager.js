import { isFunction } from "./validators";

const eventManager = {
  eventsMapper: new Map(),

  add(event, callback) {
    this.eventsMapper.has(event) || this.eventsMapper.set(event, []);
    this.eventsMapper.get(event).push(callback);
  },

  delete(event) {
    this.eventsMapper.delete(event);
  },

  emit(event, args) {
    console.log("event in emit ", event);
    if (!this.eventsMapper.has(event)) {
      return false;
    }
    this.eventsMapper.get(event).forEach((callback) => {
      if (isFunction(callback)) {
        setTimeout(() => callback(args), 0);
      }
    });
  },
};

export default eventManager;
