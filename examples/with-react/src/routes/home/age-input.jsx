import {useFields} from 'ffw-react';

function AgeInput() {
  const [age] = useFields(['age']);
  console.log('-----', 'AgeInput');

  return (
    <div>
      <span>
        AgeInput: age = {''}
        <input {...age.react.getFieldHelpers()} onChange={age.onNativeInput} />
      </span>
    </div>
  );
}

export default AgeInput;
