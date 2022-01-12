import {expect} from '@jest/globals';
import FieldReact from './field-react';

import {Form} from 'ffw-base';

describe('', () => {
  it('getInputProps()', () => {
    const form = new Form<FieldReact>({
      createField: (form, name) =>
        new FieldReact({
          name,
          form,
        }),
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
    const form = new Form<FieldReact>({
      createField: (form, name) =>
        new FieldReact({
          name,
          form,
        }),
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
