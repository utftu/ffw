import {render} from '@testing-library/react';
import {createElement} from 'react';
import {useForm} from '../use-form/use-form.js';
import {FfwProvider} from './context.js';
import {expect, describe, it} from 'vitest';
import {Form} from 'ffw';

describe('context', () => {
  it('useFormContext', () => {
    let useFormResult;
    let useInitFormResult;
    function Child() {
      useFormResult = useForm();
      return null;
    }

    function Parent() {
      useInitFormResult = new Form();
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
