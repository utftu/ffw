/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {waitAsync} from './utils.js';
import React, {createElement} from 'react';
import {Form} from 'ffw-base';
import useInitForm from './use-init-form.js';
import context from './conext.js';
import useForm from './use-form.js';

describe('use-form', () => {
  it('subscribe', async () => {
    let form;
    let parentRenderCount = 0;
    let childRenderCount = 0;
    let unsubRenderCount = 0;
    function Parent() {
      ++parentRenderCount;
      const form = useInitForm({
        initValues: {
          name: 'robbin',
          age: 42,
        },
        batch: act,
      });
      return createElement(context.Provider, {value: form}, [
        createElement(Child, {key: '0'}),
        createElement(UnsubChild, {key: '1'}),
      ]);
    }
    function Child() {
      ++childRenderCount;
      form = useForm('name', 'age');

      return createElement('div', null, 'Child');
    }
    function UnsubChild() {
      ++unsubRenderCount;
      return createElement('div', null, 'unsub');
    }
    act(() => {
      render(createElement(Parent));
    });

    expect(form instanceof Form).toBe(true);

    act(() => {
      form.setValues({
        name: 'bobbin',
        age: 43,
      });
    });

    await waitAsync(0);

    expect(parentRenderCount).toBe(1);
    expect(unsubRenderCount).toBe(1);
    expect(childRenderCount).toBe(2);
  });
});
