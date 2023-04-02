import addSvelte from './add-svelte.js';
import {Form} from 'ffw';
import {jest} from '@jest/globals';
import waitTime from 'utftu/wait-time';

describe('add-svelte', () => {
  it('readable', async () => {
    const subscribe = jest.fn();
    const form = new Form({
      initValues: {
        name: 'Aleksey',
      },
      plugins: [addSvelte],
    });
    const name = form.fields.name;

    name.svelte.value.subscribe(subscribe);
    expect(subscribe.mock.calls[0][0]).toBe('Aleksey');

    name.set('Ivan');
    await waitTime();

    expect(subscribe.mock.calls[1][0]).toBe('Ivan');
  });

  it('writable', async () => {
    const subscribe = jest.fn();
    const form = new Form({
      initValues: {
        name: 'Aleksey',
      },
      plugins: [addSvelte],
    });
    const name = form.fields.name;

    name.svelte.value.subscribe(subscribe);
    expect(subscribe.mock.calls[0][0]).toBe('Aleksey');

    name.svelte.value.set('Ivan');
    expect(name.value).toBe('Ivan');
  });
});
