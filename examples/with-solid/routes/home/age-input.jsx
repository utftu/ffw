import {getFfwContext} from 'ffw-solid';

export function AgeInput() {
  const ffw = getFfwContext();
  const ageFfw = ffw.fields.age;

  return (
    <div>
      <input value={ageFfw.solid.value()} onInput={ageFfw.onNativeInput} />
    </div>
  );
}
