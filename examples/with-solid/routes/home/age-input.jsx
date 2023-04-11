import {getFfwContext} from 'ffw-solid';

function AgeInput() {
  const ffw = getFfwContext();
  const ageFfw = ffw.fields.age;

  return (
    <div>
      <input value={ageFfw.solid.value()} onInput={ffw.onNativeInput} />
    </div>
  );
}

export default AgeInput;
