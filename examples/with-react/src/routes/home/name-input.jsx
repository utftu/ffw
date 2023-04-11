import {useFields} from 'ffw-react';

function NameInput() {
  const [name] = useFields(['name']);
  console.log('-----', 'NameInput');

  return (
    <div>
      <span>
        NameInput: name = {''}
        <input
          {...name.react.getFieldHelpers()}
          onChange={name.onNativeInput}
        />
      </span>
    </div>
  );
}

export default NameInput;
