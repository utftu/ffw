import {useFfs} from '../../dist/cjs';

function NameInput() {
  const form = useFfs('name');
  console.log('-----', 'NameInput');

  return <input {...form.f.name.getInputField()} />;
}

export default NameInput;
