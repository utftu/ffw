import {useMemo} from 'react';
import FormReact from '../form-react/form-react.js';

function useInitForm(options = {}) {
  return useMemo(() => {
    return new FormReact(options);
  }, []);
}

export default useInitForm;
