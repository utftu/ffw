import Form from './form';
import {createFormProxy} from './form-proxy';

describe('form-proxy', () => {
  describe('.fields && .f', () => {
    it('valid', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      const proxy = createFormProxy(form, ['age']);
      expect(proxy.fields.age.value).toBe(42);
    });
    it('invalid', () => {
      const form = new Form({
        initValues: {
          age: 42,
        },
      });
      const proxy = createFormProxy(form, ['name']);
      expect(() => proxy.fields.age.value).toThrow();
    });
  });
  describe('set multi data', () => {
    it('setValues()', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      const proxy = createFormProxy(form, ['name']);
      form.setValues({
        name: 'bobbin',
      });
      expect(proxy.fields.name.value).toBe('bobbin');
      expect(() =>
        proxy.setValues({
          age: 43,
        })
      ).toThrow();
    });
    it('setErrors()', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      const proxy = createFormProxy(form, ['name']);
      form.setErrors({
        name: 'wrong1',
      });
      expect(proxy.fields.name.error).toBe('wrong1');
      expect(() =>
        proxy.setErrors({
          age: 'wrong2',
        })
      ).toThrow();
    });
    it('setTouches()', () => {
      const form = new Form({
        initValues: {
          age: 42,
          name: 'robbin',
        },
      });
      const proxy = createFormProxy(form, ['name']);
      form.setTouches({
        name: true,
      });
      expect(proxy.fields.name.touched).toBe(true);
      expect(() =>
        proxy.setTouches({
          age: true,
        })
      ).toThrow();
    });
  });
  it('unknown property', () => {
    const form = new Form({
      initValues: {
        age: 42,
      },
    });

    // @ts-ignore
    expect(form.abc).toBe(undefined);
  });
});
