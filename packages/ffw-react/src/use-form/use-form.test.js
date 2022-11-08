/** @jest-environment jsdom */

import {it} from '@jest/globals';
import {renderHook} from '@testing-library/react';
import {Form} from 'ffw';
import FormReact from '../form-react/form-react.js';
import '@testing-library/jest-dom';
import {FfwProvider} from '../old';
import useForm from './use-form.js';

describe('use-form', () => {
  it('custom', () => {
    const form = new Form();
    const {result} = renderHook(() => useForm(form));
    expect(result.current).toBe(form);
  });
  it('context', () => {
    const form = new Form();
    const {result} = renderHook(() => useForm(form), {
      wrapper: ({children}) => (
        <FfwProvider value={form}>{children}</FfwProvider>
      ),
    });
    expect(result.current).toBe(form);
  });
});
