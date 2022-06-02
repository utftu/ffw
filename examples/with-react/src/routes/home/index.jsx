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
    options: {
      checkPrevData: false
    }
  });
  globalThis.form = ffw;
  return (
    <FfwProvider value={ffw}>
      <div>
        <AgeInput />
        <AgeListener />
        <GlobalListener />
        <NameInput />
        <div onClick={() => {
          ffw.f.name.set('1')
          ffw.f.age.set('2')
        }}>click</div>
      </div>
    </FfwProvider>
  );
}

export default Home;
