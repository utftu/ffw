import {useMemo} from 'react';
import Form, {FormProps} from './form';

function useGlobalForm(options: FormProps) {
  return useMemo(() => {
    return new Form(options);
  }, []);
}

export default useGlobalForm;
