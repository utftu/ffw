import {Schema} from 'yup';

export function convertYupToTest(yupSchema: Schema) {
  return async (value: any) => {
    try {
      await yupSchema.validate(value);
      return '';
    } catch (error) {
      return (error as Error).message;
    }
  };
}

export function prepareYup(obj: Record<string, Schema>) {
  const newObj: Record<string, (value: any) => Promise<string>> = {};
  for (const key in obj) {
    newObj[key] = convertYupToTest(obj[key]);
  }
  return newObj;
}
