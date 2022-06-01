import {useInitFfw, FfwProvider} from 'ffw';
import AgeInput from './age-input';
import AgeListener from './age-listener';
import GlobalListener from './global-listener';
import NameInput from './name-input';

function Home() {
  const ffw = useInitFfw({
    initValues: {
      name: 'aleks',
      age: 42,
    },
  });
  globalThis.form = ffw;
  return (
    <FfwProvider value={ffw}>
      <div>
        <AgeInput />
        <AgeListener />
        <GlobalListener />
        <NameInput />
      </div>
    </FfwProvider>
  );
}

export default Home;
