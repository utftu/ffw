import {useState} from 'react';
import batch from './batch/react-batched-updates.native.js';
import {Form} from 'ffw/dist/types/index.js';
import FieldReact from './field-react.js';

function useInitForm(options = {}) {
  const [state] = useState(() => ({
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
