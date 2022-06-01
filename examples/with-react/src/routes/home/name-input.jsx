import {useFfw} from 'ffw';

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
