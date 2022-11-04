import * as yup from 'yup';
import {jest} from '@jest/globals';
import Field from '../field/field.js';
import {waitAsync} from '../utils.js';
import {prepareYup} from '../validators/yup.js';
import Form from './form.js';

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
  it('getValues()', () => {
    const form = new Form();
    form.fields.testField = new Field({
      form,
      value: {
        arr: [new Field({form, value: 'arr'})],
        objectField: new Field({
          form,
          value: 'obj',
        }),
      },
    });
    expect(form.getValues()).toEqual({
      testField: {
        arr: ['arr'],
        objectField: 'obj',
      },
    });
  });
  it('getErrors()', () => {
    const form = new Form();
    form.fields.testField = new Field({
      form,
      value: {
        arr: [new Field({form, error: 'arr'})],
        objectField: new Field({
          form,
          error: 'obj',
        }),
      },
    });
    expect(form.getErrors()).toEqual({
      testField: {
        arr: ['arr'],
        objectField: 'obj',
      },
    });
  });
  it('validate()', async () => {
    const form = new Form({
      initValues: {
        age: 'wrong',
        name: 'robbin',
      },
      validateSchema: prepareYup({
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
  it('validateOnMount', async () => {
    const form = new Form({
      options: {
        validateOnMount: true,
      },
      initValues: {
        age: 'wrong',
        age1: 'wrong1',
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
        age1: yup.number().required(),
      }),
    });
    await waitAsync(100);
    const errors = form.getErrors();
    expect(errors.age).not.toBe('');
    expect(errors.age1).not.toBe('');
  });
  // it.only('setErrors()', async () => {
  //   const form = new Form({
  //     initValues: {
  //       age: 42,
  //       name: 'robbin',
  //     },
  //     validateSchema: yup.object({}),
  //   });
  //   const ageListener = jest.fn();
  //   const nameListener = jest.fn();
  //   form.fields.age.subscribe('error', ageListener);
  //   form.fields.name.subscribe('error', nameListener);
  //   form.setErrors({
  //     age: 'error1',
  //     name: 'error2',
  //   });
  //   await waitAsync();
  //   expect(form.fields.age.error).toBe('error1');
  //   expect(form.fields.name.error).toBe('error2');
  //   expect(ageListener.mock.calls.length).toBe(1);
  //   expect(nameListener.mock.calls.length).toBe(1);
  // });
  // it('setError()', async () => {
  //   const form = new Form({
  //     initValues: {
  //       name: 'robbin',
  //     },
  //   });
  //   const listener = jest.fn();
  //   form.fields.name.subscribe('error', listener);
  //   form.setError('name', 'you are bobbin');
  //   await waitAsync();
  //   expect(form.fields.name.error).toBe('you are bobbin');
  //   expect(listener.mock.calls.length).toBe(1);
  // });
  it('getErrors() || errors', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
        address: 'moscow',
      },
    });
    form.fields.age.setError('error');
    form.fields.name.setError('error1');

    expect(form.getErrors()).toEqual({
      age: 'error',
      name: 'error1',
    });
    expect(form.errors).toEqual({
      age: 'error',
      name: 'error1',
    });
  });

  it.only('reset()', () => {
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

    // age.set(43, false);
    //
    // form.setValues({
    //   age: 43,
    //   name: 'bobbin',
    //   address: 'London',
    // });
    // form.setTouches({
    //   age: true,
    // });
    // form.setErrors({
    //   name: 'WRONG NAME!',
    // });
    form.reset();

    console.log('-----', 'form.getValues()', form.getValues());
    expect(form.getValues()).toEqual({
      age: 42,
      name: 'robbin',
      address: 'Moscow',
    });
    expect(form.getErrors()).toEqual({});
    expect(form.getTouches()).toEqual({
      age: false,
      name: false,
      address: false,
    });
  });
  it('setValues()', async () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
        address: 'Moscow',
      },
      validateSchema: yup.object({}),
    });
    const ageListener = jest.fn();
    const nameListener = jest.fn();
    const addressListener = jest.fn();
    form.fields.age.subscribe('value', ageListener);
    form.fields.name.subscribe('value', nameListener);
    form.fields.address.subscribe('value', addressListener);

    form.setValues({
      age: 43,
      name: 'bobbin',
    });
    expect(form.fields.age.value).toBe(43);
    expect(form.fields.name.value).toBe('bobbin');
    await waitAsync();
    expect(ageListener.mock.calls.length).toBe(1);
    expect(nameListener.mock.calls.length).toBe(1);
    expect(addressListener.mock.calls.length).toBe(0);
  });
  it('setValue()', async () => {
    const form = new Form({
      initValues: {
        name: 'robbin',
      },
    });
    const listener = jest.fn();
    form.fields.name.subscribe('value', listener);
    form.setValue('name', 'bobbin');
    expect(form.fields.name.value).toBe('bobbin');
    await waitAsync();
    expect(listener.mock.calls.length).toBe(1);
  });
  it('getValues() || .values', () => {
    const values = {
      age: 42,
      name: 'robbin',
    };
    const form = new Form({
      initValues: values,
    });

    expect(form.getValues()).toEqual(values);
    expect(form.values).toEqual(values);
  });
  it('setTouches()', async () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
      validateSchema: yup.object({}),
    });
    const ageListener = jest.fn();
    const nameListener = jest.fn();
    form.fields.age.subscribe('touched', ageListener);
    form.fields.name.subscribe('touched', nameListener);

    form.setTouches({
      age: true,
      name: false,
    });
    expect(form.fields.age.touched).toBe(true);
    expect(form.fields.name.touched).toBe(false);
    await waitAsync();
    expect(ageListener.mock.calls.length).toBe(1);
    expect(nameListener.mock.calls.length).toBe(0);
  });
  it('setTouched()', async () => {
    const form = new Form({
      initValues: {
        name: 'robbin',
      },
    });
    const listener = jest.fn();
    form.fields.name.subscribe('touched', listener);
    form.setTouched('name', true);
    expect(form.fields.name.touched).toBe(true);
    await waitAsync();
    expect(listener.mock.calls.length).toBe(1);
  });
  it('getTouches() || touches', () => {
    const form = new Form({
      initValues: {
        age: 42,
        name: 'robbin',
      },
    });
    form.fields.age.setTouched(true);
    form.fields.name.setTouched(false);

    expect(form.getTouches()).toEqual({
      age: true,
      name: false,
    });
    expect(form.touches).toEqual({
      age: true,
      name: false,
    });
  });
  describe('validate()', () => {
    it('valid shallow', async () => {
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
    it('valid inner', async () => {
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
      form.fields.outerField.addChildrenField(
        form.fields.outerField.value.inner1.inner2.innerField
      );
      const valid = await form.validate();
      expect(valid).toBe(true);
    });
    // it('valid inner', async () => {
    //   const form = new Form({
    //     initValues: {
    //       outerField: '',
    //     },
    //   });
    //   form.fields.outerField.set({
    //     inner1: {
    //       inner2: {
    //         innerField: new Field({
    //           form,
    //           test: () => '',
    //         }),
    //       },
    //     },
    //   });
    //   form.fields.outerField.addChildrenField(
    //     form.fields.outerField.value.inner1.inner2.innerField
    //   );
    //   const valid = await form.validate();
    //   expect(valid).toBe(true);
    // });
    it('error shallow', async () => {
      const form = new Form({
        initValues: {
          age: 'hello',
        },
        validateSchema: {
          age: () => 'age error',
        },
      });
      const valid = await form.validate();
      expect(valid).toBe(false);
    });
    it('error inner', async () => {
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
      form.fields.outerField.addChildrenField(
        form.fields.outerField.value.inner1.inner2.innerField
      );
      const valid = await form.validate();
      expect(valid).toBe(false);
    });
  });
});
