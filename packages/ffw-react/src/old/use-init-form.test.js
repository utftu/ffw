/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import React, {createElement} from 'react';
import {Form} from 'ffw/dist/types/index.js';
import useInitForm from './use-init-form.js';
import {jest} from '@jest/globals';

test('return form', async () => {
  let form;
  function Component() {
    form = useInitForm();
    return createElement('div', null, 'test');
  }
  render(createElement(Component));
  expect(form instanceof Form).toBe(true);
});
