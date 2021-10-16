import {useFfs} from '../../dist/cjs';

function AgeListener() {
  const form = useFfs('age');
  console.log('-----', 'AgeListener');

  return (
    <div>
      <span>AgeListener: age = {form.f.age.value}</span>
    </div>
  );
}

export default AgeListener;
