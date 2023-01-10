import {getFfwContext} from 'ffw-solid';

function FormValid() {
  const ffw = getFfwContext();

  return <div>{ffw.solid.valid() ? 'valid' : 'invalid'}</div>;
}

export default FormValid;
