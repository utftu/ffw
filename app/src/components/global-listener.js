import {useFfs} from '../../dist/cjs';

function GlobalListener() {
  useFfs();
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
