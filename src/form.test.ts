import Form from './form';
import * as yup from 'yup';
import {waitAsync} from './utils';
import {jest} from '@jest/globals';

describe('form', () => {
  it('initValues', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    expect(form.fields.age.value).toBe(42);
    expect(form.fields.name.value).toBe('robbin');
  });
  it('validate()', async () => {
    const form = new Form({
      initValues: {
        age: 'wrong',
        name: 'robbin',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
        name: yup.string().required(),
      }),
    });
    const validateResult = await form.validate();
    expect(validateResult).toBe(false);
    form.fields.age.set(42);
    const validateResult1 = await form.validate();
    expect(validateResult1).toBe(true);
  });
  it('onSubmit()', async () => {
    const submitListener = jest.fn();
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      onSubmit: submitListener,
      validateSchema: yup.object({
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
  it('validateOnMount', async () => {
    const form = new Form({
      options: {
        validateOnMount: true,
      },
      initValues: {
        age: 'wrong',
        age1: 'wrong1',
      },
      validateSchema: yup.object({
        age: yup.number().required(),
        age1: yup.number().required(),
      }),
    });
    await waitAsync();
    const errors = form.getErrors();
    expect(errors.age).not.toBe('');
    expect(errors.age1).not.toBe('');
  });
  it('setTouches()', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    const ageListener = jest.fn();
    const nameListener = jest.fn();
    form.fields.age.listeners.push(ageListener);
    form.fields.name.listeners.push(nameListener);
    form.setTouches({
      age: true,
      name: false,
    });
    expect(form.fields.age.touched).toBe(true);
    expect(form.fields.name.touched).toBe(false);
    expect(ageListener.mock.calls.length).toBe(1);
    expect(nameListener.mock.calls.length).toBe(1);
  });
  it('setErrors()', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    const ageListener = jest.fn();
    const nameListener = jest.fn();
    form.fields.age.listeners.push(ageListener);
    form.fields.name.listeners.push(nameListener);
    form.setErrors({
      age: 'error1',
      name: 'error2',
    });
    expect(form.fields.age.error).toBe('error1');
    expect(form.fields.name.error).toBe('error2');
    expect(ageListener.mock.calls.length).toBe(1);
    expect(nameListener.mock.calls.length).toBe(1);
  });
  it('setValues()', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    const ageListener = jest.fn();
    const nameListener = jest.fn();
    form.fields.age.listeners.push(ageListener);
    form.fields.name.listeners.push(nameListener);
    form.setValues({
      age: 43,
      name: 'bobbin',
    });
    expect(form.fields.age.value).toBe(43);
    expect(form.fields.name.value).toBe('bobbin');
    expect(ageListener.mock.calls.length).toBe(1);
    expect(nameListener.mock.calls.length).toBe(1);
  });
});
