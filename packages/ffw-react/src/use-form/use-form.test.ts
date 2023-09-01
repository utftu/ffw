import {it, describe, expect} from 'vitest';
import {renderHook} from '@testing-library/react';
import {Form} from 'ffw';
import {createElement} from 'react';
import {FfwProvider} from '../context/context.ts';
import {useForm} from './use-form.ts';
import {FormReact} from '../plugin/plugin.ts';

describe('use-form', () => {
  it('custom', () => {
    const form = new Form() as FormReact;
    const {result} = renderHook(() => useForm(form));
    expect(result.current).toBe(form);
  });
  it('context', () => {
    const form = new Form() as FormReact;
    const {result} = renderHook(() => useForm(form), {
      wrapper: ({children}) =>
        createElement(FfwProvider, {value: form}, children),
    });
    expect(result.current).toBe(form);
  });
});
