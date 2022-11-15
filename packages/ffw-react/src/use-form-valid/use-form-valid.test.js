/** @jest-environment jsdom */

import {renderHook, act} from '@testing-library/react';
import {it, describe} from '@jest/globals';
import '@testing-library/jest-dom';
import {Form} from 'ffw';
import {prepareYup} from 'ffw/src/index.js';
import waitTime from 'utftu/wait-time.js';
import useFormValid from './use-form-valid.js';
import * as yup from 'yup';

describe('use-form-valid', () => {
  it('base', async () => {
    const form = new Form({
      initValues: {
        age: 25,
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
      }),
    });
    const {result} = renderHook(() => useFormValid(form));
    expect(result.current).toBe(true);
    await act(async () => {
      form.fields.age.set('hello');
      await waitTime();
    });
    expect(result.current).toBe(false);
  });
});
