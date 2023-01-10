import {getFfwContext} from 'ffw-solid';

function AgeInput() {
  const ffw = getFfwContext();

  return (
    <div>
      <input {...ffw.fields.age.getInput()} />
    </div>
  );
}

export default AgeInput;
