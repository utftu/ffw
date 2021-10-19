import Field from './field';
import {jest} from '@jest/globals';
import Form from './form';
import * as yup from 'yup';
import {waitAsync} from './utils';

const ageFieldParams = {
  value: 42,
  name: 'age',
  getForm: jest.fn() as any,
};

export const fieldMockExpectFunctions = {
  getForm: expect.any(Function),
  onBlur: expect.any(Function),
  onChange: expect.any(Function),
  getInputField: expect.any(Function),
  getSelectField: expect.any(Function),
};

describe('field', () => {
  describe('init', () => {
    it('required params', () => {
      expect(
        new Field({
          value: 42,
          name: 'age',
          getForm: jest.fn(),
        })
      ).toEqual({
        value: 42,
        name: 'age',
        error: '',
        touched: false,
        listeners: [],
        ...fieldMockExpectFunctions,
      });
    });
    it('all params', () => {
      expect(
        new Field({
          value: 42,
          name: 'age',
          error: 'too young',
          touched: true,
          getForm: jest.fn(),
        })
      ).toEqual({
        value: 42,
        name: 'age',
        error: 'too young',
        touched: true,
        listeners: [],
        ...fieldMockExpectFunctions,
      });
    });
  });

  it('triggerListeners()', () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.listeners.push(listener);
    field.triggerListeners();

    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toEqual({
      value: 42,
      name: 'age',
      error: '',
      touched: false,
      listeners: [listener],
      ...fieldMockExpectFunctions,
    });
  });

  it('set()', () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.listeners.push(listener);
    field.set(43);

    expect(field.value).toBe(43);
    expect(listener.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(listener.mock.calls[0][0].value).toBe(43);
  });

  it('setError()', () => {
    const field = new Field(ageFieldParams);
    const listener: any = jest.fn();
    field.listeners.push(listener);
    field.setError('Wrong value');

    expect(field.error).toBe('Wrong value');
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0].error).toBe('Wrong value');
  });

  it('setTouched()', () => {
    const field = new Field(ageFieldParams);
    const listener: any = jest.fn();
    field.listeners.push(listener);
    field.setTouched(true);

    expect(field.touched).toBe(true);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0].touched).toBe(true);
  });

  describe('validate()', () => {
    it('invalid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error.length).not.toBe(0);
      expect(validateResult).toBe(false);
    });
    it('valid', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      const validateResult = await form.fields.age.validate();
      expect(form.fields.age.error.length).toBe(0);
      expect(validateResult).toBe(true);
    });
    it('invalid -> valid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      await form.fields.age.validate();
      expect(form.fields.age.error.length).not.toBe(0);
      form.fields.age.set(43);
      await form.fields.age.validate();
      expect(form.fields.age.error).toBe('');
    });
  });

  describe('onBlur()', () => {
    it('set touched', () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({}),
      });
      const listener = jest.fn();
      form.fields.age.listeners.push(listener);

      form.fields.age.onBlur();
      expect(form.fields.age.touched).toBe(true);
      expect(listener.mock.calls.length).toBe(1);
    });
    it('validateOnBlur = true', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onBlur();
      await waitAsync();
      expect(form.fields.age.error).not.toBe(0);
    });
    it('validateOnBlur = false', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onBlur();
      await waitAsync();
      expect(form.fields.age.error).not.toBe(0);
    });
  });

  describe('onChange()', () => {
    it('set value', () => {
      const form = new Form({
        initValues: {
          age: '42',
        },
        validateSchema: yup.object({}),
      });
      const listener = jest.fn();
      form.fields.age.listeners.push(listener);

      form.fields.age.onChange({
        target: {
          value: '43',
        },
      });
      expect(form.fields.age.value).toBe('43');
      expect(listener.mock.calls.length).toBe(1);
    });

    it('validateOnChange = true', async () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitAsync();
      expect(form.fields.age.error.length).not.toBe(0);
    });
    it('validateOnChange = false', async () => {
      const form = new Form({
        options: {
          validateOnChange: false,
        },
        initValues: {
          age: 42,
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
      });
      form.fields.age.onChange({
        target: {
          value: 'invalid',
        },
      });
      await waitAsync();
      expect(form.fields.age.error).toBe('');
    });
  });
});
