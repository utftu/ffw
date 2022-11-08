import {useFfw} from 'packages/ffw-react';

function NameInput() {
  const form = useFfw('name');
  console.log('-----', 'NameInput');

  return (
    <div>
      <span>
        NameInput: name = {''}
        <input {...form.f.name.getInput()} />
      </span>
    </div>
  );
}

export default NameInput;
