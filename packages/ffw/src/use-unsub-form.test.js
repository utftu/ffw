/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import React, {createElement} from 'react';
import {Form} from 'ffw-base';
import context from './conext.js';
import useUnsubForm from './use-unsub-form.js';
import useInitForm from './use-init-form.js';
import {jest} from '@jest/globals';

describe('useUnsubForm', () => {
  test('return form', async () => {
    let result;
    function Parent() {
      const form = useInitForm({
        initValues: {
          name: 'robbin',
        },
      });
      return createElement(
        context.Provider,
        {value: form},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm([]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.form.fields.name.value).toBe('robbin');
  });
  it('array no config', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return createElement(
        context.Provider,
        {value: form},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm([['test1', 'test2']]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('array with config context', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return createElement(
        context.Provider,
        {value: form},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm([['test1', 'test2'], {context}]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('array with config form', () => {
    let result;
    let form;
    function Parent() {
      form = useInitForm();
      return createElement(
        context.Provider,
        {value: null},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm([
        ['test1', 'test2'],
        {
          form,
        },
      ]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params no config', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return createElement(
        context.Provider,
        {value: form},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2']);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params with context', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return createElement(
        context.Provider,
        {value: form},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2', {context}]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params with form', () => {
    let result;
    let form;
    function Parent() {
      form = useInitForm();
      return createElement(
        context.Provider,
        {value: null},
        createElement(Child)
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2', {form}]);
      return createElement('div', null, 'Child');
    }
    render(createElement(Parent));
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
});
