import {useFfw} from '../../../dist/cjs/dev.js';

function NameInput() {
  const form = useFfw('name');
  console.log('-----', 'NameInput');

  return (
    <div>
      <span>
        NameInput: name = {''}
        <input {...form.f.name.getInputField()} />
      </span>
    </div>
  );
}

export default NameInput;
