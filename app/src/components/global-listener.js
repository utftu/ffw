import {useFfs} from '../../dist/cjs';

function GlobalListener() {
  useFfs();
  console.log('-----', 'GlobalListener');

  return <div>GlobalListener</div>;
}

export default GlobalListener;
