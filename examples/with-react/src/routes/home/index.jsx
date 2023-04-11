import {FfwProvider, addReactPlugin} from 'ffw-react';
import {prepareYup, Form} from 'ffw';
import AgeInput from './age-input';
import AgeListener from './age-listener';
import FormValid from './form-valid';
import GlobalListener from './global-listener';
import NameInput from './name-input';
import * as yup from 'yup';
import {useMemo} from 'react';

function Home() {
  const form = useMemo(() => {
    return new Form({
      plugins: [addReactPlugin],
      initValues: {
        name: 'aleks',
        age: 42,
      },
      validateSchema: prepareYup({
        age: yup.number().required(),
      }),
    });
  }, []);
  // const form = useInitForm({
  //   initValues: {
  //     name: 'aleks',
  //     age: 42,
  //   },
  //   validateSchema: prepareYup({
  //     age: yup.number().required(),
  //   }),
  // });

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
            form.f.name.set('hello');
            form.f.age.set('world');
          }}
        >
          change state
        </div>
      </div>
    </FfwProvider>
  );
}

export default Home;
