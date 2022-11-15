import {useCallback} from 'react';
import useForm from '../use-form/use-form.js';
import useSubscribe from '../use-subscribe/use-subscribe.js';

function useFormValid(customForm) {
  const form = useForm(customForm);

  const subscribe = useCallback(
    (listener) => {
      return form.on('valid', listener);
    },
    [form]
  );

  const get = useCallback(() => {
    return form.getValid();
  }, [form]);

  const value = useSubscribe(get, subscribe);

  return value;
}

export default useFormValid;
