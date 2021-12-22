import {useMemo} from 'react';
import batch from './batch/react-batched-updates';
import {FormProps, Form} from 'ffw-base';
import FieldReact from './field-react';

function useInitForm(options: FormProps = {}): Form {
  return useMemo(() => {
    return new Form({
      batch,
      createField: (form, name) =>
        new FieldReact({
          name,
          form,
        }),
      ...options,
    });
  }, []);
}

export default useInitForm;
