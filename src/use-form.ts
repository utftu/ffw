import context from './conext';
import Form from './form';
import {useContext, useEffect, useMemo, useState} from 'react';
import {createFormProxy} from './form-proxy';
import Field from './field';

function useForm(...deps: string[] | any): Form {
  let realDeps
  let customContext
  let customForm
  const lastArg = deps[deps.length - 1]
  if (Array.isArray(deps[0])) {
    realDeps = deps[0]
  } else if (typeof deps[deps.length - 1] !== 'string') {
    realDeps = realDeps.slice(0, deps.length - 1)
    const config = lastArg
    if (config.context) {
      customContext = config.context
    } else if (config.form) {
      customForm = config.form
    } else {
      throw new Error('Invalid config')
    }
  } else {
    realDeps = deps
  }

  const contextForm = useContext(customContext || context);
  const form = customForm || customContext
  // let form
  //
  // if (lastArg instanceof Form) {
  //   form = lastArg
  // } else if (typeof lastArg === 'string') {
  //   form = contextForm
  // } else {
  //   // custom context
  // }

  const [, setUpdate] = useState(null);

  useMemo(() => {
    deps.forEach((name) => {
      if (!form.fields[name]) {
        form.addField(name, new Field({name, getForm: () => form, value: ''}));
      }
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
      form.addGlobalListener(listener);
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
