import {useState} from 'react';

function Test() {
  const [open, setOpen] = useState();
  return <div style={{background: open ? 'red' : ''}}>test</div>;
}

export default Test;
