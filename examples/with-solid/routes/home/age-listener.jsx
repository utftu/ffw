import {getFfwContext} from 'ffw-solid';

function AgeListener() {
  const ffw = getFfwContext();

  return <div>{ffw.fields.age.solid.value()}</div>;
}

export default AgeListener;
