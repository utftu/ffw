import {useFormValid} from 'ffw-react';

function FormValid() {
  const formValid = useFormValid();
  return <div>{formValid ? 'Valid' : 'Invalid'}</div>;
}

export default FormValid;
