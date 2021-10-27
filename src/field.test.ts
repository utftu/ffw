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
  getForm: expect.anything(),
  onBlur: expect.anything(),
  onChange: expect.anything(),
  getInputField: expect.anything(),
  getSelectField: expect.anything(),
};

describe('field', () => {
  describe('init', () => {
    it('required params', () => {
      expect(
        new Field({
          name: 'age',
          getForm: jest.fn(),
        })
      ).toMatchObject({
        value: '',
        name: 'age',
        error: '',
        touched: false,
        listeners: [],
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
      ).toMatchObject({
        value: 42,
        name: 'age',
        error: 'too young',
        touched: true,
        listeners: [],
      });
    });
  });

  it('triggerListeners()', () => {
    const field = new Field(ageFieldParams);
    const listener = jest.fn();
    field.listeners.push(listener);
    field.triggerListeners();

    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      value: 42,
      name: 'age',
      error: '',
      touched: false,
      listeners: [listener],
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
      expect(form.fields.age.error).not.toBe('');
    });
    it('validateOnBlur = false', async () => {
      const form = new Form({
        initValues: {
          age: 'invalid',
        },
        validateSchema: yup.object({
          age: yup.number().required(),
        }),
        options: {
          validateOnBlur: false,
        },
      });
      form.fields.age.onBlur();
      await waitAsync();
      expect(form.fields.age.error).toBe('');
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

  it('getInputProps()', () => {
    const form = new Form({
      initValues: {
        name: 'robbin',
      },
    });

    expect(form.fields.name.getInputProps()).toEqual({
      value: 'robbin',
      name: form.fields.name.name,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
    form.fields.name.getInputProps().onBlur();
    expect(form.fields.name.touched).toBe(true);
    form.fields.name.setTouched(false);
    form.fields.name.getInputProps().onChange({
      target: {
        value: 'bobbin',
      },
    });
    expect(form.fields.name.value).toBe('bobbin');
    expect(form.fields.name.touched).toBe(false);
  });

  it('getSelectProps()', () => {
    const form = new Form({
      initValues: {
        name: 'robbin',
      },
    });

    expect(form.fields.name.getSelectProps()).toEqual({
      value: 'robbin',
      name: form.fields.name.name,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
    form.fields.name.getSelectProps().onBlur();
    expect(form.fields.name.touched).toBe(true);
    form.fields.name.setTouched(false);
    form.fields.name.getSelectProps().onChange('bobbin');
    expect(form.fields.name.value).toBe('bobbin');
    expect(form.fields.name.touched).toBe(false);
  });
});
