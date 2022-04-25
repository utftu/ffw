import {expect} from '@jest/globals';
import FieldReact from './field-react';

import {Form} from 'ffw-base';

describe('', () => {
  it('getInput()', () => {
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

    expect(form.fields.name.getInput()).toEqual({
      value: 'robbin',
      name: form.fields.name.name,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
    form.fields.name.getInput().onBlur();
    expect(form.fields.name.touched).toBe(true);
    form.fields.name.setTouched(false);
    form.fields.name.getInput().onChange({
      target: {
        value: 'bobbin',
      },
    });
    expect(form.fields.name.value).toBe('bobbin');
    expect(form.fields.name.touched).toBe(false);
  });

  it('getSelect()', () => {
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

    expect(form.fields.name.getSelect()).toEqual({
      value: 'robbin',
      name: form.fields.name.name,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });
    form.fields.name.getSelect().onBlur();
    expect(form.fields.name.touched).toBe(true);
    form.fields.name.setTouched(false);
    form.fields.name.getSelect().onChange('bobbin');
    expect(form.fields.name.value).toBe('bobbin');
    expect(form.fields.name.touched).toBe(false);
  });
});
