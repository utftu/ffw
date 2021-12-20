function a(state) {
  return;
}

a(
  {
    name: 'aleks',
  },
  (state, setState) => {
    return <div>hello {state.name}</div>;
  }
);
