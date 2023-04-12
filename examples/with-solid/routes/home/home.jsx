import {FfwContextProvider, addSolidPlugin} from 'ffw-solid';
import {AgeInput} from './age-input.jsx';
import {AgeListener} from './age-listener.jsx';
import {FormValid} from './form-valid.jsx';
import {NameInput} from './name-input.jsx';
import {NameListener} from './name-listener.jsx';
import {prepareYup, FfwForm} from 'ffw';
import * as yup from 'yup';

function Home() {
  const form = new FfwForm({
    initValues: {
      age: 42,
      name: 'Aleksey',
    },
    validateSchema: prepareYup({
      age: yup.number().required(),
      name: yup.string().required(),
    }),
    plugins: [addSolidPlugin()],
  });
  globalThis.form = form;
  return (
    <FfwContextProvider value={form}>
      <div>
        <AgeInput />
        <AgeListener />
        <NameInput />
        <NameListener />
        <FormValid />
      </div>
    </FfwContextProvider>
  );
}

export default Home;
