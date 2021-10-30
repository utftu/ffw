/**
 * @jest-environment jsdom
 */

import {render} from '@testing-library/react';
import React from 'react';
import Form from './form';
import context from './conext';
import useUnsubForm from './use-unsub-form';
import useInitForm from './use-init-form';

describe('useUnsubForm', () => {
  test('return form', async () => {
    let result;
    function Parent() {
      const form = useInitForm({
        initValues: {
          name: 'robbin',
        },
      });
      return (
        <context.Provider value={form}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm([]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.form.fields.name.value).toBe('robbin');
  });
  it('array no config', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return (
        <context.Provider value={form}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm([['test1', 'test2']]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('array with config context', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return (
        <context.Provider value={form}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm([['test1', 'test2'], {context}]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('array with config form', () => {
    let result;
    let form;
    function Parent() {
      form = useInitForm();
      return (
        <context.Provider value={null}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm([
        ['test1', 'test2'],
        {
          form,
        },
      ]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params no config', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return (
        <context.Provider value={form}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2']);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params with context', () => {
    let result;
    function Parent() {
      const form = useInitForm();
      return (
        <context.Provider value={form}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2', {context}]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
  it('params with form', () => {
    let result;
    let form;
    function Parent() {
      form = useInitForm();
      return (
        <context.Provider value={null}>
          <Child />
        </context.Provider>
      );
    }
    function Child() {
      result = useUnsubForm(['test1', 'test2', {form}]);
      return <div>Child</div>;
    }
    render(<Parent />);
    expect(result.form instanceof Form).toBe(true);
    expect(result.fieldNames).toEqual(['test1', 'test2']);
  });
});
