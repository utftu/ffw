# FFW

Ffw is form package. Ffw implements partial subscription to certain fields.

### Setting

```tsx
import {useGlobalFfw, FfwProvider} from 'ffw'
import AgeListener from './age-listener'

function App() {
  const form = useGlobalFfw({
    initValues: {
      age: 42,
      name: 'Robbin'
    }
  })
  
  return (
    <FfwProvider value={form}>
      <AgeLitener/>
    </FfwProvider>
  )
}

export default App
```

### Using

```tsx
import {useFfw} from "ffw";

function AgeListener() {
  const form = useFfw(
    // list fields to subscribe
    'age'
  )

  return (
    <input {...form.fields.age.getInputField()}/>
  )
}

export default AgeListener
```