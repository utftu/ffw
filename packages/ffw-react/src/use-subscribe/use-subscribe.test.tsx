import {describe, expect, it, vi} from 'vitest';
import {Cb, useSubscribe} from './use-subscribe.ts';
import {render, renderHook} from '@testing-library/react';
import {waitTime} from 'utftu';

describe('use-subscribe', () => {
  it('get value', () => {
    const value = {};
    const {result, rerender} = renderHook(() => {
      return useSubscribe(
        () => value,
        () => () => {},
      );
    });
    expect(result.current).toBe(value);
    rerender();
    expect(result.current).toBe(value);
  });
  it('subscribe', async () => {
    let value = 1;
    const get = () => value;
    const subscribe = (localCb: any) => {
      cb = localCb;
      return () => {};
    };
    let cb!: (a?: any) => void;
    const {result} = renderHook(() => {
      return useSubscribe(get, subscribe);
    });
    expect(result.current).toBe(value);
    cb(2);
    await waitTime(20);
    expect(result.current).toBe(2);
  });
  it('unsubscribe', () => {
    const unsubscribe = vi.fn();
    let renderChild = true;
    const Child = () => {
      useSubscribe(
        () => {},
        () => unsubscribe,
      );
      return null;
    };
    const Parent = () => {
      if (renderChild === true) {
        return <Child />;
      }
      return null;
    };
    const {rerender} = render(<Parent />);
    expect(unsubscribe.mock.calls.length).toBe(0);
    renderChild = false;
    rerender(<Child />);
    expect(unsubscribe.mock.calls.length).toBe(1);
  });
  it('dependency get', () => {
    let subscribeCb;
    const store = {
      get: () => '1',
      subscribe: (cb: Cb) => {
        subscribeCb = cb;
        return () => {};
      },
    };
    const {result, rerender} = renderHook(() => {
      return useSubscribe(store.get, store.subscribe);
    });
    expect(result.current).toBe('1');
    store.get = () => '2';
    rerender();
    expect(result.current).toBe('2');
  });
  it('dependency subscribe', async () => {
    let value = '1';
    const store = {
      get: () => value,
      subscribe: () => {
        return () => {};
      },
    };
    const {result, rerender} = renderHook(() => {
      return useSubscribe(store.get, store.subscribe);
    });
    expect(result.current).toBe('1');
    value = '2';
    store.subscribe = () => {
      return () => {};
    };
    rerender();
    await waitTime(20);
    expect(result.current).toBe('2');
  });
});
