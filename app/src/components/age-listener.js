import {useFfs} from '../../dist/cjs';

function AgeListener() {
  const form = useFfs('age');
  console.log('-----', 'AgeListener');

  return <div>child</div>;
}

export default AgeListener;
