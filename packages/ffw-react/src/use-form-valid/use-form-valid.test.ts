import {renderHook, act} from '@testing-library/react';
import {it, describe, expect} from 'vitest';
import {Form, prepareDesy} from 'ffw';
import {d} from 'desy';
import {waitTime} from 'utftu';
import {useFormValid} from './use-form-valid.ts';
import * as yup from 'yup';
import {FormReact} from '../plugin/plugin.ts';

describe('use-form-valid', () => {
  it('base', async () => {
    const form = new Form({
      initValues: {
        age: 25,
      },
      validateSchema: prepareDesy({
        age: d.number(),
      }),
    }) as FormReact;
    const {result} = renderHook(() => useFormValid(form));
    expect(result.current).toBe(true);
    await act(async () => {
      form.fields.age.set('hello');
      await waitTime();
    });
    expect(result.current).toBe(false);
  });
});
