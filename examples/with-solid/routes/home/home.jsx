import {initForm} from 'ffw-solid';

function Home() {
  const form = initForm({
    initValues: {
      name: 'Aleksey',
    },
  });
  globalThis.form = form;
  console.log('form.fields.name.solid', form.fields.name.solid.value());
  return (
    <div>
      <input
        value={form.fields.name.solid.value()}
        onInput={(event) => {
          console.log('onchange');
          form.fields.name.set(event.target.value);
        }}
      />
      {form.fields.name.solid.value()}
    </div>
  );
}

export default Home;
