import {type Schema} from 'desy';

export function prepareDesy(obj: Record<string, Schema<any>>) {
  const newObj: Record<string, (value: any) => string> = {};
  for (const key in obj) {
    newObj[key] = (validate: any) => obj[key].validate(validate);
  }
  return newObj;
}
