import type {Field} from 'ffw-base';
import {Form} from 'ffw-base';

declare class FieldReact<
  TValue,
  TName,
  TForm extends Form<FieldReact<TValue, TName, TForm>>
> extends Field<TValue, TForm> {
  getInput(): {
    value: TValue;
    name: TName;
    onChange: (event: {target: {value: string}}) => void;
    onBlur: () => void;
  };

  getSelect(): {
    value: TValue;
    name: TName;
    onChange: (newValue: TValue) => void;
    onBlur: () => void;
  };
}

export default FieldReact;
