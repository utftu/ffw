import {useFfw} from '../../dist/cjs/dev.js';

function AgeInput() {
  const form = useFfw('age');
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
