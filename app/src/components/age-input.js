import {useFfs} from '../../dist/cjs';

function AgeInput() {
  const form = useFfs('age');
  console.log('-----', 'AgeInput');

  return <input {...form.f.age.getInputField()} />;
}

export default AgeInput;
