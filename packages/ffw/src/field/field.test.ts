import {Field} from './field.ts';
import {vi, expect, it, describe} from 'vitest';
import {Form} from '../form/form.ts';
import {waitTime} from 'utftu';
import {prepareDesy} from '../validators/desy.ts';
import {d} from 'desy';

const formMock = new Form();

const ageFieldParams = {
  value: 42,
  name: 'age',
  form: formMock,
};

describe('field', () => {
  describe('init', () => {
    it('default params', () => {
      debugger;
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
    const listener = vi.fn();
    field.on('value', listener);
    field.set(43);

    expect(field.value).toBe(43);
    await waitTime();
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe(43);
  });

  it('setError()', async () => {
    const field = new Field(ageFieldParams);
    const listener = vi.fn();
    field.on('error', listener);
    field.setError('Wrong value');

    await waitTime();
    expect(field.error).toBe('Wrong value');
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe('Wrong value');
  });

  it('setTouched()', async () => {
    const field = new Field(ageFieldParams);
    const listener = vi.fn();
    field.on('touched', listener);
    field.setTouched(true);

    await waitTime();
    expect(field.touched).toBe(true);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe(true);
  });

  describe('validate()', () => {
    it('invalid', async () => {
      const form = new Form({
        initValues: {
          age: 'wrong',
        },
        validateSchema: prepareDesy({
          age: d.number(),
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
        validateSchema: prepareDesy({
          age: d.number(),
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
        validateSchema: prepareDesy({
          age: d.number(),
        }),
      });
      await form.fields.age.validate();
      expect(form.fields.age.error).not.toBe('');
      form.fields.age.set(43);
      await form.fields.age.validate();
      expect(form.fields.age.error).toBe('');
    });
    describe('onBlur()', () => {
      it('set touched', async () => {
        const form = new Form({
          initValues: {
            age: 42,
          },
          validateSchema: prepareDesy({}),
        });
        const listener = vi.fn();
        form.fields.age.on('touched', listener);

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
          validateSchema: prepareDesy({
            age: d.number(),
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
          validateSchema: prepareDesy({
            age: d.number(),
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

    describe('onNativeInput()', () => {
      it('set value', async () => {
        const form = new Form({
          initValues: {
            age: '42',
          },
          validateSchema: prepareDesy({}),
        });
        const listener = vi.fn();
        form.fields.age.on('value', listener);

        form.fields.age.onNativeInput({
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
          validateSchema: prepareDesy({
            age: d.number(),
          }),
        });
        form.fields.age.onNativeInput({
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
          validateSchema: prepareDesy({
            age: d.number(),
          }),
        });
        form.fields.age.onNativeInput({
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
        validateSchema: prepareDesy({
          age: d.number(),
        }),
      });
      const field = form.fields.age;
      const listener = vi.fn();
      field.on('errorTouched', listener);

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
        validateSchema: prepareDesy({
          age: d.number(),
        }),
      });
      const field = form.f.age;
      const valueListener = vi.fn();
      const errorListener = vi.fn();
      const touchedListener = vi.fn();
      const errorTouchedListener = vi.fn();

      field.on('value', valueListener);
      field.on('error', errorListener);
      field.on('touched', touchedListener);
      field.on('errorTouched', errorTouchedListener);

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

  describe('setData()', () => {
    it('checkPrevData: false(default)', () => {
      const form = new Form({
        initValues: {
          name: 'Aleksey',
        },
      });
      const wasSet = form.fields.name.setData('value', 'Aleksey');
      expect(wasSet).toBe(true);
    });
    it('checkPrevData: true', () => {
      const form = new Form({
        initValues: {
          name: 'Aleksey',
        },
        options: {
          checkPrevData: true,
        },
      });
      const wasSet = form.fields.name.setData('value', 'Aleksey');
      expect(wasSet).toBe(false);
    });
  });
});
