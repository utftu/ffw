import {useFields} from 'ffw-react';

function GlobalListener() {
  const [form] = useFields((form) => [form]);
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
