import {useFfs} from '../../dist/cjs';

function NameInput() {
  const form = useFfs('name');
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
