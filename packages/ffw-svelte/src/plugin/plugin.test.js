import {addSveltePlugin} from './plugin.js';
import {Form} from 'ffw';
import {describe, it, vi, expect} from 'vitest';
import {waitTime} from 'utftu';

describe('add-svelte', () => {
  it('readable', async () => {
    const subscribe = vi.fn();
    const form = new Form({
      initValues: {
        name: 'Aleksey',
      },
      plugins: [addSveltePlugin()],
    });
    const name = form.fields.name;

    name.svelte.value.subscribe(subscribe);
    expect(subscribe.mock.calls[0][0]).toBe('Aleksey');

    name.set('Ivan');
    await waitTime();

    expect(subscribe.mock.calls[1][0]).toBe('Ivan');
  });

  it('writable', async () => {
    const subscribe = vi.fn();
    const form = new Form({
      initValues: {
        name: 'Aleksey',
      },
      plugins: [addSveltePlugin()],
    });
    const name = form.fields.name;

    name.svelte.value.subscribe(subscribe);
    expect(subscribe.mock.calls[0][0]).toBe('Aleksey');

    name.svelte.value.set('Ivan');
    expect(name.value).toBe('Ivan');
  });
});
