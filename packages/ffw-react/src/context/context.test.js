/** @jest-environment jsdom */

import {render} from '@testing-library/react';
import {createElement} from 'react';
import useForm from '../use-form/use-form.js';
import useInitForm from '../use-init-form/use-init-form.js';
import {FfwProvider} from './context.js';
import '@testing-library/jest-dom';

describe('context', () => {
  it('useFormContext', () => {
    let useFormResult;
    let useInitFormResult;
    function Child() {
      useFormResult = useForm();
      return null;
    }

    function Parent() {
      useInitFormResult = useInitForm();
      return createElement(
        FfwProvider,
        {value: useInitFormResult},
        createElement(Child)
      );
    }
    render(createElement(Parent));
    expect(useFormResult).toBe(useInitFormResult);
  });
});
