# FFW

Ffw is form package. Ffw implements partial subscription to certain fields.

[Sandbox](https://codesandbox.io/s/ffw-23v1r?file=/src/app.js)

## Install:

```bash
npm i ffw
```

## Goals of ffw:

- subscription to certain fields
- api that looks like formik
- performance
- convenience improvement

### Setting

```tsx
import {useGlobalFfw, FfwProvider} from 'packages/ffw-base';
import AgeListener from './age-listener';

function App() {
  const form = useGlobalFfw({
    initValues: {
      age: 42,
      name: 'Robbin',
    },
  });

  return (
    <FfwProvider value={form}>
      <User />
      <Age />
    </FfwProvider>
  );
}

export default App;
```

### Using

```tsx
import {useFfw} from 'packages/ffw-base';

function User() {
  const form = useFfw(
    // list fields to subscribe
    'name',
    'age'
  );

  return (
    <div>
      <input {...form.fields.name.getInput()} />
      <input {...form.fields.age.getInput()} />
    </div>
  );
}

export default User;
```

or

```tsx
import {useFfwField} from 'packages/ffw-base';

function Age() {
  const ageField = useFfwField('age');

  return <input {...ageField.getInput()} />;
}

export default Age;
```
