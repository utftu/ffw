import {getFfwContext} from 'ffw-solid';

export function NameInput() {
  const ffw = getFfwContext();
  const nameField = ffw.fields.name;
  return (
    <div>
      <input
        value={nameField.solid.value()}
        onInput={nameField.onNativeInput}
      />
    </div>
  );
}
