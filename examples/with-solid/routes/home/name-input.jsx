import {getFfwContext} from 'ffw-solid';

function NameInput() {
  const ffw = getFfwContext();

  return (
    <div>
      <input {...ffw.fields.name.getInput()} />
    </div>
  );
}

export default NameInput;
