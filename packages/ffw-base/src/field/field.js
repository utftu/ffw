import {Atom, createStateAtomSyncRoot, selectRoot} from 'strangelove';

const defaultTest = () => '';

class Field {
  form = null;
  atoms = {};
  atom = null;

  constructor({
    value = '',
    touched = false,
    error = '',
    test = defaultTest,
    form = null,
  }) {
    this.form = form;
    this.test = defaultTest;

    this.initParams = {
      value,
      touched,
      error,
      test,
    };
    this.test = test;
    this.atom = createStateAtomSyncRoot(null, form.root);

    this.atoms.value = createStateAtomSyncRoot(value, form.root);
    this.atoms.value.name = 'value';
    Atom.connect(this.atoms.value, this.atom);

    this.atoms.touched = createStateAtomSyncRoot(touched, form.root);
    this.atoms.touched.name = 'touched';
    Atom.connect(this.atoms.touched, this.atom);

    this.atoms.error = createStateAtomSyncRoot(error, form.root);
    this.atoms.error.name = 'error';
    Atom.connect(this.atoms.error, this.atom);

    this.atoms.errorTouched = selectRoot((get) => {
      if (!get(this.atoms.touched)) {
        return '';
      }
      return get(this.atoms.error);
    }, form.root);
    this.atoms.errorTouched.name = 'errorTouched';
    this.atoms.errorTouched.onBeforeUpdate = (atom) => {
      if (atom.get() === atom.value.externalGet()) {
        return false;
      }
      return true;
    };

    form.addField(this);
  }

  get value() {
    return this.atoms.value.get();
  }

  set value(newValue) {
    this.set(newValue);
  }

  get error() {
    return this.atoms.error.get();
  }

  set error(newError) {
    this.setError(newError);
  }

  get errorTouched() {
    return this.atoms.errorTouched.get();
  }

  get touched() {
    return this.atoms.touched.get();
  }

  set touched(newTouched) {
    this.setTouched(newTouched);
  }

  setData(name, newData) {
    if (!this.atoms[name]) {
      const atom = createStateAtomSyncRoot(newData, this.form.root);
      this.atoms[name] = atom;
      Atom.connect(atom, this.atom);
      Atom.connect(atom, this.form.atoms.global);
      this.form.root.update(atom);
    } else {
      this.atoms[name].set(newData);
    }
  }

  setError(error) {
    this.setData('error', error);
  }

  setTouched(touched) {
    this.setData('touched', touched);
  }

  set(value, validate) {
    this.setData('value', value);

    if (validate === true) {
      this.validate();
      return;
    }

    if (validate === false) {
      return;
    }

    if (validate === undefined && this.form.options.validateOnChange) {
      this.validate();
    }
  }

  async validate() {
    const error = await this.test(this.atoms.value.get());

    this.setError(error);
    return error;
  }

  subscribe(listener) {
    this.atom.listeners.add(listener);

    return () => this.atom.listeners.remove(listener);
  }

  unsubscribe(listener) {
    this.atom.listeners.remove(listener);
  }

  onChange = (event) => {
    this.set(event.target.value);
  };

  onBlur = () => {
    this.setTouched(true);

    if (this.form.options.validateOnBlur) {
      this.validate();
    }
  };

  reset() {
    this.setData('value', this.initParams.value);
    this.setData('touched', this.initParams.touched);
    this.setData('error', this.initParams.error);
  }

  _childrenFields = new Set();
  addChildrenField(field) {
    this._childrenFields.add(field);
  }

  removeChildrenField(field) {
    this._childrenFields.delete(field);
  }
}

export default Field;
