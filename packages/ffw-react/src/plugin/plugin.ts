import {Field, Form} from 'ffw';
import {ChangeEventHandler} from 'react';

export type FieldReact<TValue = any> = Field<TValue> & {
  react: {
    getFieldHelpers: () => {
      value: TValue;
      onInput: ChangeEventHandler<HTMLInputElement>;
    };
  };
};

export type FormReact = Form<FieldReact>;

function transformField(field: Field) {
  const fieldReact = field as FieldReact;
  fieldReact.react = {
    getFieldHelpers: () => {
      return {
        value: field.value,
        onInput: (event: {target: HTMLInputElement}) =>
          field.set(event.target.value),
        onBlur: () => field.onBlur(),
      };
    },
  };
}

export const addReactPlugin =
  () =>
  <TForm extends Form>(form: TForm) => {
    const oldCreateField = form.createField;
    form.createField = function (...args) {
      const field = oldCreateField.apply(form, args);
      transformField(field);
      return field;
    };
    for (const key in form.fields) {
      const field = form.fields[key];
      transformField(field);
    }
    return form as any as FormReact;
  };
