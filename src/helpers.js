import Field from './field';
export async function waitAsync(milliseconds = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
export function createNonExistField(form, name) {
    if (!form.fields[name]) {
        form._addField(name, new Field({ name, getForm: () => form, value: '' }));
    }
}
