function transformField(field) {
  field.react = {};

  field.react.getFieldHelpers = () => {
    return {
      value: field.value,
      onChange: (...args) => field.set(...args),
      onBlur: (...args) => field.onBlur(...args),
    };
  };
}

export const addReactPlugin = () => (form) => {
  const oldCreateField = form.createField;
  form.createField = function (...args) {
    const field = oldCreateField.apply(form, args);
    transformField(field);
    return field;
  };
};
