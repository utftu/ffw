/** @jest-environment jsdom */

import {renderHook, act} from '@testing-library/react';
import {it, describe, jest} from '@jest/globals';
import '@testing-library/jest-dom';
import {Form} from 'ffw';
import waitTime from 'utftu/wait-time.js';
import useFields from './use-fields.js';

describe('use-fields', () => {
  it('init func', () => {
    const mock = jest.fn((form) => {
      return [form.fields.name, 'age'];
    });
    const form = new Form({
      initValues: {
        name: 'Ivan',
        age: 25,
      },
    });
    const {result} = renderHook(() => useFields(mock, form));
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0][0]).toBe(form);
    expect(result.current[0]).toBe(form.fields.name);
    expect(result.current[1]).toBe(form.fields.age);
  });
  it('init arr', () => {
    const form = new Form({
      initValues: {
        name: 'Ivan',
        age: 25,
      },
    });
    const {result} = renderHook(() =>
      useFields([form.fields.name, 'age'], form)
    );
    expect(result.current[0]).toBe(form.fields.name);
    expect(result.current[1]).toBe(form.fields.age);
  });
  it('update', async () => {
    const form = new Form({
      initValues: {
        name: 'Ivan',
        age: 25,
      },
    });
    let updateCount = 0;
    const {result} = renderHook(() => {
      updateCount++;
      return useFields([form.fields.name, 'age'], form);
    });
    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBe(form.fields.name);
    expect(result.current[1]).toBe(form.fields.age);
    expect(updateCount).toBe(1);
    await act(async () => {
      form.fields.name.set('Ivan Cool', false);
      await waitTime();
    });
    expect(updateCount).toBe(2);
  });
});
