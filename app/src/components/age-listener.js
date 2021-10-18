import {useFfw} from '../../dist/cjs/dev.js';

function AgeListener() {
  const form = useFfw('age');
  console.log('-----', 'AgeListener');

  return (
    <div>
      <span>AgeListener: age = {form.f.age.value}</span>
    </div>
  );
}

export default AgeListener;
