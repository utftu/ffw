import {Field, Form} from 'ffw';

export type FieldReact<TValue = any> = Field<TValue> & {
  react: any;
};

export type FormReact = Form<FieldReact>;

function transformField(field: Field) {
  const fieldReact = field as FieldReact;
  fieldReact.react = {};

  fieldReact.react.getFieldHelpers = () => {
    return {
      value: field.value,
      onInput: (event: {target: HTMLInputElement}) =>
        field.set(event.target.value),
      onBlur: () => field.onBlur(),
    };
  };
}

export const addReactPlugin = () => (form: Form) => {
  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.apply(form, args);
    transformField(field);
    return field;
  };
};
