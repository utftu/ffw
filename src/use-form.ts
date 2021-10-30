import Form from './form';
import {useEffect, useMemo, useState} from 'react';
import {createFormProxy} from './form-proxy';
import Field from './field';
import useUnsubForm from './use-unsub-form';

function useForm(...deps: any[]): Form {
  const {form, fieldNames} = useUnsubForm(deps);

  const [, setUpdate] = useState(null);

  useMemo(() => {
    fieldNames.forEach((name) => {
      if (!form.fields[name]) {
        form.addField(name, new Field({name, getForm: () => form, value: ''}));
      }
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
        form.fields[fieldName].listeners.push(listener);
      });
    }
    return () => {
      if (deps.length === 0) {
        form.removeGlobalListener(listener);
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
