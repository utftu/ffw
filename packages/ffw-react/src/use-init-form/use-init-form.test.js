/** @jest-environment jsdom */

import {renderHook} from '@testing-library/react';
import {it} from '@jest/globals';
import '@testing-library/jest-dom';
import {Form} from 'ffw';
import FormReact from '../form-react/form-react.js';
import useInitForm from './use-init-form.js';

it('use-init-ffw-form', () => {
  const {result} = renderHook(() => useInitForm());
  expect(result.current instanceof Form).toBe(true);
  expect(result.current instanceof FormReact).toBe(true);
});
