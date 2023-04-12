import {getFfwContext} from 'ffw-solid';

export function FormValid() {
  const ffw = getFfwContext();

  return <div>{ffw.solid.valid() ? 'valid' : 'invalid'}</div>;
}
