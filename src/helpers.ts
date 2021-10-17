import Field from './field';
import Form from './form';

export async function waitAsync(milliseconds = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function createNonExistField(form: Form, name: string) {
  if (!form.fields[name]) {
    form._addField(name, new Field({name, getForm: () => form, value: ''}));
  }
}
