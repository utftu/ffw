import * as yup from 'yup';
import Field from '../field/field.js';
import {prepareYup} from '../validators/yup.js';
import Form from './form.js';
import {vi, expect, it, describe} from 'vitest';

describe('form', () => {
  it('initValues', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
    });
    expect(form.fields.age.value).toBe(42);
    expect(form.fields.name.value).toBe('robbin');
  });
  describe('.values', () => {
    it('shallow', () => {
      const values = {
        age: 42,
        name: 'robbin',
      };
      const form = new Form({
        initValues: values,
      });

      expect(form.values).toEqual(values);
    });
  });
  describe('.touches', () => {
    it('shallow', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      form.fields.age.setTouched(true);
      form.fields.name.setTouched(false);

      expect(form.touches).toEqual({
        age: true,
      });
    });
  });
  describe('.errors', () => {
    it('shallow', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
          address: 'moscow',
        },
      });
      form.fields.age.setError('error');
      form.fields.name.setError('error1');

      expect(form.errors).toEqual({
        age: 'error',
        name: 'error1',
      });
    });
  });
  it('onSubmit()', async () => {
    const submitListener = vi.fn();
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      onSubmit: submitListener,
      validateSchema: prepareYup({
        age: yup.number().required(),
        name: yup.string().required(),
      }),
    });
    form.f.age.set('wrong');
    await form.submit();
    expect(submitListener.mock.calls.length).toBe(0);
    form.f.age.set(43);
    await form.submit();
    expect(submitListener.mock.calls.length).toBe(1);
  });

  it('reset()', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
        address: 'Moscow',
      },
    });
    const age = form.fields.age;
    const name = form.fields.name;
    const address = form.fields.address;

    age.data.value = 43;
    age.data.touched = true;

    name.data.value = 'bobbin';
    name.data.error = 'WRONG NAME';

    address.data.value = 'London';

    form.reset();
    expect(form.values).toEqual({
      age: 42,
      name: 'robbin',
      address: 'Moscow',
    });
    expect(form.errors).toEqual({});
    expect(form.touches).toEqual({});
  });

  describe('.valid', () => {
    it('shallow', async () => {
      const form = new Form({
        initValues: {
          age: 'hello',
        },
        validateSchema: {
          age: () => '',
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(true);
    });
    it('deep', async () => {
      const form = new Form({
        initValues: {
          outerField: '',
        },
      });
      form.fields.outerField.set({
        inner1: {
          inner2: {
            innerField: new Field({
              form,
              test: () => '',
            }),
          },
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(true);
    });
  });
  describe('validate()', () => {
    it('shallow', async () => {
      const form = new Form({
        initValues: {
          age: 'hello',
        },
        validateSchema: {
          age: (value) => (typeof value === 'number' ? '' : 'error message'),
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(false);
      form.fields.age.set(42);
      const valid2 = await form.validate();
      expect(valid2).toBe(true);
    });
    it('deep', async () => {
      const form = new Form({
        initValues: {
          outerField: '',
        },
      });
      form.fields.outerField.set({
        inner1: {
          inner2: {
            innerField: new Field({
              form,
              test: () => 'innerField error',
            }),
          },
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(false);
    });
  });
});
