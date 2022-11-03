/**
 * @jest-environment jsdom
 */

import Field from './field.js';
import {jest, expect} from '@jest/globals';
import Form from '../form/form.js';
import * as yup from 'yup';
import waitTime from 'utftu/wait-time.js';
import {prepareYup} from '../validators/yup.js';

const formMock = new Form({});

const ageFieldParams = {
  value: 42,
  name: 'age',
  form: formMock,
};

describe('field', () => {
  describe('init', () => {
    it('default params', () => {
      const field = new Field({
        form: formMock,
      });
      expect(field.value).toBe('');
      expect(field.error).toBe('');
      expect(field.touched).toBe(false);
      expect(field.errorTouched).toBe('');
    });
    it('all params', () => {
      const field = new Field({
        form: formMock,
        value: 'value',
        error: 'error',
        touched: true,
      });
      expect(field.value).toBe('value');
      expect(field.error).toBe('error');
      expect(field.touched).toBe(true);
      expect(field.errorTouched).toBe('error');
    });
  });
  it('set()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.atoms.value.listeners.subscribe(listener);
    field.set(43);

    expect(field.value).toBe(43);
    await waitTime();
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0].get()).toBe(43);
  });

  it('setError()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.atoms.error.subscribe(listener);
    field.setError('Wrong value');

    await waitTime();
    expect(field.error).toBe('Wrong value');
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0].get()).toBe('Wrong value');
  });

  it('setTouched()', async () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.atoms.touched.subscribe(listener);
    field.setTouched(true);

    await waitTime();
    expect(field.touched).toBe(true);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0].get()).toBe(true);
  });

  describe('validate()', () => {
    it('invalid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error).not.toBe('');
      expect(validateResult).not.toBe('');
    });
    it('valid', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error).toBe('');
      expect(validateResult).toBe('');
    });
    it('invalid -> valid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      await form.fields.age.validate();
      expect(form.fields.age.error).not.toBe('');
      form.fields.age.set(43);
      await form.fields.age.validate();
      expect(form.fields.age.error).toBe('');
    });
  });

  describe('onBlur()', () => {
    it('set touched', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: prepareYup({}),
      });
      const listener = jest.fn();
      form.fields.age.atoms.touched.subscribe(listener);

      form.fields.age.onBlur();
      expect(form.fields.age.touched).toBe(true);
      await waitTime();
      expect(listener.mock.calls.length).toBe(1);
    });
    it('validateOnBlur = true', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onBlur();
      await waitTime();
      expect(form.fields.age.error).not.toBe('');
    });
    it('validateOnBlur = false', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
        options: {
          validateOnBlur: false,
        },
      });
      form.fields.age.onBlur();
      await waitTime();
      expect(form.fields.age.error).toBe('');
    });
  });

  describe('onChange()', () => {
    it('set value', async () => {
      const form = new Form({
        initValues: {
          age: '42',
        },
        validateSchema: prepareYup({}),
      });
      const listener = jest.fn();
      form.fields.age.atoms.value.subscribe(listener);

      form.fields.age.onChange({
        target: {
          value: '43',
        },
      });
      await waitTime();
      expect(form.fields.age.value).toBe('43');
      expect(listener.mock.calls.length).toBe(1);
    });

    it('validateOnChange = true', async () => {
      const form = new Form({
        options: {
          validateOnChange: true,
        },
        initValues: {
          age: 42,
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitTime();
      expect(form.fields.age.error).not.toBe('');
    });
    it('validateOnChange = false', async () => {
      const form = new Form({
        options: {
          validateOnChange: false,
        },
        initValues: {
          age: 42,
        },
        validateSchema: prepareYup({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitTime();
      expect(form.fields.age.error).toBe('');
    });
  });
  it('errorTouched', async () => {
    const form = new Form({
      initValues: {
        age: '42',
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
      }),
    });
    const field = form.fields.age;
    const listener = jest.fn();
    field.atoms.errorTouched.subscribe(listener);

    expect(field.errorTouched).toBe('');
    field.set('error text');

    await waitTime();

    expect(field.errorTouched).toBe('');
    expect(listener.mock.calls.length).toBe(0);

    field.set(43);
    await waitTime();

    field.setTouched(true);
    await waitTime();

    expect(field.errorTouched).toBe('');
    expect(listener.mock.calls.length).toBe(0);

    field.set('error text');

    await waitTime();
    expect(field.errorTouched).not.toBe('');
    expect(listener.mock.calls.length).toBe(1);
  });
  it('emits', async () => {
    const form = new Form({
      initValues: {
        age: '42',
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
      }),
    });
    const field = form.f.age;
    const valueListener = jest.fn();
    const errorListener = jest.fn();
    const touchedListener = jest.fn();
    const errorTouchedListener = jest.fn();

    field.atoms.value.listeners.subscribe(valueListener);
    field.atoms.error.listeners.subscribe(errorListener);
    field.atoms.touched.listeners.subscribe(touchedListener);
    field.atoms.errorTouched.listeners.subscribe(errorTouchedListener);

    field.set('hehe');
    await waitTime();
    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(1);
    expect(touchedListener.mock.calls.length).toBe(0);
    expect(errorTouchedListener.mock.calls.length).toBe(0);

    field.setError('hehe');
    await waitTime();
    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(2);
    expect(touchedListener.mock.calls.length).toBe(0);
    expect(errorTouchedListener.mock.calls.length).toBe(0);

    field.setTouched(true);
    await waitTime();

    expect(valueListener.mock.calls.length).toBe(1);
    expect(errorListener.mock.calls.length).toBe(2);
    expect(touchedListener.mock.calls.length).toBe(1);
    expect(errorTouchedListener.mock.calls.length).toBe(1);
  });
});