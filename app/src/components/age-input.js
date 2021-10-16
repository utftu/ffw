import {useFfs} from '../../dist/cjs';

function AgeInput() {
  const form = useFfs('age');
  console.log('-----', 'AgeInput');

  return (
    <div>
      <span>
        AgeInput: age = {''}
        <input {...form.f.age.getInputField()} />
      </span>
    </div>
  );
}

export default AgeInput;
