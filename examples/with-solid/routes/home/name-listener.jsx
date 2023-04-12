import {getFfwContext} from 'ffw-solid';

export function NameListener() {
  const ffw = getFfwContext();

  return <div>{ffw.fields.name.solid.value()}</div>;
}
