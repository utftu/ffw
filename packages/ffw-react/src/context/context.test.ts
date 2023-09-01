import {render} from '@testing-library/react';
import {createElement} from 'react';
import {useForm} from '../use-form/use-form.ts';
import {FfwProvider} from './context.ts';
import {expect, describe, it} from 'vitest';
import {Form} from 'ffw';
import {FormReact} from '../plugin/plugin.ts';

describe('context', () => {
  it('useFormContext', () => {
    let useFormResult;
    let useInitFormResult;
    function Child() {
      useFormResult = useForm();
      return null;
    }

    function Parent() {
      useInitFormResult = new Form() as FormReact;
      return createElement(
        FfwProvider,
        {value: useInitFormResult},
        createElement(Child),
      );
    }
    render(createElement(Parent));
    expect(useFormResult).toBe(useInitFormResult);
  });
});
