/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import {waitAsync} from './utils';
import React from 'react';
import {Form} from '../ffw-base';
import useInitForm from './use-init-form';
import context from './conext';
import useForm from './use-form';

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
      });
      return (
        <context.Provider value={form}>
          <Child />
          <UnsubChild />
        </context.Provider>
      );
    }
    function Child() {
      ++childRenderCount;
      form = useForm('name', 'age');

      return <div>Child</div>;
    }
    function UnsubChild() {
      ++unsubRenderCount;
      return <div>unsub</div>;
    }
    render(<Parent />);
    expect(form instanceof Form).toBe(true);

    form.setValues({
      name: 'bobbin',
      age: 43,
    });

    await waitAsync(0);

    expect(parentRenderCount).toBe(1);
    expect(unsubRenderCount).toBe(1);
    expect(childRenderCount).toBe(2);
  });
});
