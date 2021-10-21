##### useGlobalFfw(props: FormProps)

### Setting

```tsx
import {useGlobalFfw, FfwProvider} from 'ffw'

function App() {
  const form = useGlobalFfw({
    initValues: {
      age: 42,
      name: 'Robbin'
    }
  })
  
  return (
    <FfwProvider value={form}>
      <AnotherComponent/>
    </FfwProvider>
  )
}

export default App
```

### Using

```ts
useFfw
```