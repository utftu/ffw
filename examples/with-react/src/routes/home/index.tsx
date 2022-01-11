import {useInitFfw, FfwProvider} from 'ffw';
import AgeInput from 'src/routes/home/age-input';
import AgeListener from 'src/routes/home/age-listener';
import GlobalListener from 'src/routes/home/global-listener';
import NameInput from 'src/routes/home/name-input';

function Home() {
  const ffw = useInitFfw({
    initValues: {
      name: 'aleks',
      age: 42
    }
  });
  globalThis.form = ffw
  return (
    <FfwProvider value={ffw}>
      <div>
        <AgeInput/>
        <AgeListener/>
        <GlobalListener/>
        <NameInput/>
      </div>
    </FfwProvider>
  );
}

export default Home;
