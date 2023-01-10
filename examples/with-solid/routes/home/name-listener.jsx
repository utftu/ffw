import {getFfwContext} from 'ffw-solid';

function NameListener() {
  const ffw = getFfwContext();

  return <div>{ffw.fields.name.solid.value()}</div>;
}

export default NameListener;
