import {useMemo} from 'react';
import {FormProps, Form} from 'ffw';

function useInitForm(options: FormProps = {}): Form {
  return useMemo(() => {
    return new Form(options);
  }, []);
}

export default useInitForm;
