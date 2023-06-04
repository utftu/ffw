import useSubscribeClient from './use-subscribe.client.js';
import useSubscribeServer from './use-subscribe.server.js';

export function useSubscribe(get, subscribe) {
  return typeof window === 'undefined'
    ? useSubscribeServer(get)
    : useSubscribeClient(get, subscribe);
}
