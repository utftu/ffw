import {useGlobalFfs, FfsProvider} from '../../dist/cjs';
import * as yup from 'yup';
import AgeListener from '../components/age-listener';
import {useEffect} from 'react';
import AgeInput from '../components/age-input';
import NameInput from '../components/name-input';
import GlobalListener from '../components/global-listener';

export default function Home() {
  const form = useGlobalFfs({
    initValues: {
      age: 42,
    },
    validateSchema: yup.object({
      age: yup.number().required(),
    }),
    options: {
      validateOnBlur: false,
    },
  });
  globalThis.form = form;
  // useEffect(() => {
  //   setTimeout(() => {
  //     form.f.age.set(43);
  //   }, 1000);
  // }, []);
  return (
    <FfsProvider value={form}>
      <div>
        <AgeListener />
        <AgeInput />
        <NameInput />
        <GlobalListener />
      </div>
    </FfsProvider>
  );
}
