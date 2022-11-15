import {useFields} from 'ffw-react';

function AgeListener() {
  const [age] = useFields(['age']);
  console.log('-----', 'AgeListener');

  return (
    <div>
      <span>AgeListener: age = {age.value}</span>
    </div>
  );
}

export default AgeListener;
