import {useMemo} from 'react';
import Form from './form.js';

function useGlobalForm(...args) {
  const initForm = useMemo(() => {
    return new Form(...args);
  }, []);

  return initForm;
}

export default useGlobalForm;
