import context from './conext';
import Form from './form';
import {useContext, useEffect, useMemo, useState} from 'react';
import {createNonExistField} from './helpers';
import {createFormProxy} from './form-proxy';

function useForm(...deps: string[]): Form {
  const form = useContext(context);
  const [, setUpdate] = useState(null);

  useMemo(() => {
    deps.forEach((name) => {
      createNonExistField(form, name);
    });
  }, deps);

  const proxyForm = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return createFormProxy(form, deps);
    } else {
      return null;
    }
  }, []);

  // todo subscribe on memo
  useEffect(() => {
    const listener = () => {
      setUpdate({});
    };
    if (deps.length === 0) {
      form._addGlobalListener(listener);
    } else {
      deps.forEach((fieldName) => {
        form.fields[fieldName].listeners = [
          ...form.fields[fieldName].listeners,
          listener,
        ];
      });
    }
    return () => {
      if (deps.length === 0) {
        form._addGlobalListener(listener);
      } else {
        deps.forEach((fieldName) => {
          form.fields[fieldName].listeners = form.fields[
            fieldName
          ].listeners.filter((listenerComp) => listenerComp !== listener);
        });
      }
    };
  }, deps);

  if (process.env.NODE_ENV === 'development') {
    return proxyForm;
  } else {
    return form;
  }
}

export default useForm;
