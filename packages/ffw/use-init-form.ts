import {useMemo} from 'react';
import batch from './batch/react-batched-updates';
import {FormProps, Form} from 'ffw-base';

function useInitForm(options: FormProps = {}): Form {
  return useMemo(() => {
    return new Form({batch, ...options});
  }, []);
}

export default useInitForm;
