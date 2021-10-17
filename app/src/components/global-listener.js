import {useFfw} from '../../../dist/cjs/dev.js';

function GlobalListener() {
  const form = useFfw();
  console.log('-----', 'GlobalListener');

  return (
    <div>
      <span>
        GlobalListener: age = {form.f.age.value} and name = {form.f.name.value}
      </span>
    </div>
  );
}

export default GlobalListener;
