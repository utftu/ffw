import {Form, createFormProxy} from 'ffw-base';
import {useEffect, useMemo, useState} from 'react';
import useUnsubForm from './use-unsub-form';

function useForm(...deps) {
  const {form, fieldNames} = useUnsubForm(deps);

  const [, setUpdate] = useState(null);

  useMemo(() => {
    fieldNames.forEach((name) => {
      form.getField(name);
    });
  }, fieldNames);

  const proxyForm = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return createFormProxy(form, fieldNames);
    } else {
      return null;
    }
  }, []);

  // todo subscribe on memo / layout
  useEffect(() => {
    const listener = () => {
      setUpdate({});
    };
    if (fieldNames.length === 0) {
      form.addGlobalListener(listener);
    } else {
      fieldNames.forEach((fieldName) => {
        form.fields[fieldName].subscribe('*', listener);
      });
    }
    return () => {
      if (fieldNames.length === 0) {
        form.removeGlobalListener(listener);
      } else {
        fieldNames.forEach((fieldName) => {
          form.fields[fieldName].unsubscribe('*', listener);
        });
      }
    };
  }, fieldNames);

  if (process.env.NODE_ENV === 'development') {
    return proxyForm;
  } else {
    return form;
  }
}

export default useForm;
