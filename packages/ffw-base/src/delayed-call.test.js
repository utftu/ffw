import {expect} from '@jest/globals';
import Form from './form.js';
import {waitAsync} from './utils.js';
import DelayedCalls from "./delayed-calls";

describe('delayed calls', () => {
  it('two values', async () => {
    let count = 0;
    const calls = new DelayedCalls((cb) => cb())

    calls.addCall('1', () => {
      count++
    })
    calls.addCall('2', () => {
      count++
    })

    expect(count).toBe(0)
    await waitAsync(0)
    expect(count).toBe(2)
  });
});
