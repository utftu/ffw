import {useInitForm, FfwProvider, prepareYup} from 'ffw-react';
import AgeInput from './age-input';
import AgeListener from './age-listener';
import FormValid from './form-valid';
import GlobalListener from './global-listener';
import NameInput from './name-input';
import * as yup from 'yup';

function Home() {
  const form = useInitForm({
    initValues: {
      name: 'aleks',
      age: 42,
    },
    validateSchema: prepareYup({
      age: yup.number().required(),
    }),
  });

  globalThis.form = form;
  return (
    <FfwProvider value={form}>
      <div>
        <AgeInput />
        <AgeListener />
        <GlobalListener />
        <NameInput />
        <FormValid />
        <div
          onClick={() => {
            form.f.name.set('1');
            form.f.age.set('2');
          }}
        >
          click
        </div>
      </div>
    </FfwProvider>
  );
}

export default Home;
