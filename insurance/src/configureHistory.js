import { createBrowserHistory, createHashHistory } from 'history';

export function configureHistory() {
  return window.matchMedia('(display-mode: standalone)').matches
    ? createHashHistory({ basename : '/webview'})
    : createBrowserHistory({ basename : '/webview'})
}
