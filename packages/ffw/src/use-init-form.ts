import {useMemo, useState} from 'react';
import batch from './batch/react-batched-updates';
import {FormProps, Form} from 'ffw-base';
import FieldReact from './field-react';

function useInitForm(options: FormProps = {}): Form {
  const [state] = useState<{ffw: Form}>(() => ({
    ffw: new Form({
      batch,
      createField: (form, name) =>
        new FieldReact({
          name,
          form,
        }),
      ...options,
    }),
  }));
  return state.ffw;
}

export default useInitForm;
