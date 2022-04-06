import { useEffect } from 'react';

export const useNativeAddRemoveListener = (listenerObj) => {
  useEffect(() => {
    window.callbackWeb.add_listener(listenerObj);
    return () => {
      window.callbackWeb.remove_listener();
    };
  }, []);
};

export const useNativeSendEventListener = (listenerObj, allowExecution = true) => {
  useEffect(() => {
    if (allowExecution) {
      window.callbackWeb.sendEvent(listenerObj);
    }
  }, []);
};
