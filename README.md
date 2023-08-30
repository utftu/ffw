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
import {useInitFfw, FfwProvider} from 'fww';
import User from './user';

function App() {
  const form = useInitFfw({
    initValues: {
      age: 42,
      name: 'Robbin',
    },
  });

  return (
    <FfwProvider value={form}>
      <User />
    </FfwProvider>
  );
}

export default App;
```

### Using

```tsx
import {useFfw} from 'packages/ffw-react';

function User() {
  const form = useFfw(
    // list fields to subscribe
    'name',
    'age',
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
import {useFfwField} from 'packages/ffw-react';

function Age() {
  const ageField = useFfwField('age');

  return <input {...ageField.getInput()} />;
}

export default Age;
```
