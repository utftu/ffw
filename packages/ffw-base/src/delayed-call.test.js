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
    calls.addCall('1', () => {
      count++
    })
    calls.addCall('2', () => {
      count++
    })

    expect(count).toBe(0)
    await waitAsync()
    expect(count).toBe(2)
  });
  it('clear old changes',  async() => {
    const calls = new DelayedCalls((cb) => cb())
    let a = 0;
    let b = 0
    calls.addCall('a', () => a++)
    calls.addCall('b', () => b++)
    await waitAsync()
    expect(a).toBe(1)
    expect(b).toBe(1)
    await waitAsync()
    calls.addCall('a', () => a++)
    await waitAsync()
    expect(a).toBe(2)
    expect(b).toBe(1)
  })
});
