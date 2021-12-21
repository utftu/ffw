class A {
  a() {
    console.log('a');
  }
}

class B extends A {
  constructor() {
    super();

    // console.log(super.a);

    this.b = {
      a() {
        console.log(super.super.a);
      },
    };
  }

  d() {
    console.log(super.a);
  }
}

const b = new B();
b.b.a();
