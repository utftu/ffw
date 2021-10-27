import {useInitFfw, FfwProvider} from '../../dist/cjs/dev.js';
import * as yup from 'yup';
import AgeListener from '../components/age-listener';
import AgeInput from '../components/age-input';
import NameInput from '../components/name-input';
import GlobalListener from '../components/global-listener';

export default function Home() {
  const form = useInitFfw({
    // initValues: {
    //   age: 42,
    //   name: 'Ivan',
    // },
    // validateSchema: yup.object({
    //   age: yup.number().required(),
    // }),
    // options: {
    //   validateOnBlur: false,
    // },
  });
  globalThis.form = form;
  return (
    <FfwProvider value={form}>
      <div>
        <AgeListener />
        <AgeInput />
        <NameInput />
        <GlobalListener />
      </div>
    </FfwProvider>
  );
}
