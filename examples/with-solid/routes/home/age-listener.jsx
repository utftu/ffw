import {getFfwContext} from 'ffw-solid';

export function AgeListener() {
  const ffw = getFfwContext();

  return <div>{ffw.fields.age.solid.value()}</div>;
}
