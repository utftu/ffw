/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import React from 'react';
import {Form} from 'ffw-base';
import useInitForm from './use-init-form';

test('return form', async () => {
  let form;
  function Component() {
    form = useInitForm();
    return <div>test</div>;
  }
  render(<Component />);
  expect(form instanceof Form).toBe(true);
});
