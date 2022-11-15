import {useFields} from 'ffw-react';

function AgeInput() {
  const [age] = useFields(['age']);
  console.log('-----', 'AgeInput');

  return (
    <div>
      <span>
        AgeInput: age = {''}
        <input {...age.getInput()} />
      </span>
    </div>
  );
}

export default AgeInput;
