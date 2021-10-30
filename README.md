# FFW

Ffw is form package. Ffw implements partial subscription to certain fields.

## Main goals of ffw:
* subscription to certain fields
* api that looks like formik
* performance
* convenience improvement

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
      <User/>
      <Age/>
    </FfwProvider>
  )
}

export default App
```

### Using

```tsx
import {useFfw} from "ffw";

function User() {
  const form = useFfw(
    // list fields to subscribe
    'name',
    'age'
  )

  return (
    <div>
      <input {...form.fields.name.getInputField()}/>
      <input {...form.fields.age.getInputField()}/>
    </div>
  )
}

export default User
```
or
```tsx
import {useFfwField} from "ffw";

function Age() {
  const ageField = useFfwField('age')

  return (
    <input {...ageField.getInputField()}/>
  )
}

export default Age
```

## API

```ts
type FormProps = {
  initValues?: Record<string, any>;
  validateSchema?: any; // yup schema
  options?: {
    validateOnChange: boolean,
    validateOnBlur: boolean,
    validateOnMount: boolean
  };
  onSubmit?: (form: Form) => void;
};
```

`useInitFfw`
```ts
function useInitFfw(options: FormProps): Form // init form
```

`FfwProvider`
```tsx
<FfwProvider value={form}/> //  pass form to the context
```

`useFfa`
```ts
function useFfa(fieldName1: string, fieldName2: string, ...): Form // subscribe to fields and get form
```

`useFfaField`
```ts
function useFfaField(fieldName: string): Form // subscribe to field and get form
```

`Form`
```ts
class Form {
    fields: Record<string, Field>;
    validate(): Promise<boolean>;
    submit: () => Promise<void>;
    reset(): void;
    setErrors(errors: Record<string, string>): void;
    setValue(name: string, value: any): void;
    setTouched(name: string, touched: boolean): void;
    setError(name: string, error: string): void;
    setTouches(touches: Record<string, boolean>): void;
    setValues(values: Record<string, any>): void;
    getErrors(): Record<string, string>;
    getTouches(): Record<string, boolean>;
    get values(): Record<string, any>;
    get errors(): Record<string, string>;
    get touches(): Record<string, boolean>;
    getValues(): Record<string, any>;
    batch(cb: any): void;
}
```

`Field`
```ts
class Field {
    value: any;
    touched: boolean;
    error: string;
    name: string;
    setError(error: string): void;
    setTouched(touched: boolean): void;
    set(value: any): void;
    validate(): Promise<boolean>;
    onChange: (event) => void;
    onBlur: () => void;
    getInputProps: () => {
        value: any;
        name: string;
        onChange: (event) => void;
        onBlur: () => void;
    };
    getSelectProps: () => {
        value: any;
        name: string;
        onChange: (value: any) => void;
        onBlur: () => void;
    };
}
```

