import {useFfw} from 'ffw';

function AgeInput() {
  const form = useFfw('age');
  console.log('-----', 'AgeInput');

  return (
    <div>
      <span>
        AgeInput: age = {''}
        <input {...form.fields.age.getInput()} />
      </span>
    </div>
  );
}

export default AgeInput;
