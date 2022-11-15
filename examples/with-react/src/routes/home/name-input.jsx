import {useFields} from 'ffw-react';

function NameInput() {
  const [name] = useFields(['name']);
  console.log('-----', 'NameInput');

  return (
    <div>
      <span>
        NameInput: name = {''}
        <input {...name.getInput()} />
      </span>
    </div>
  );
}

export default NameInput;
