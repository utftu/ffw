import type {Field} from 'ffw-base';

declare class FieldReact<TValue = string> extends Field<TValue> {
  getInput(): {
    value: TValue;
    name: string;
    onChange: any;
    onBlur: () => void;
  };

  getSelect(): {
    value: TValue;
    name: string;
    onChange: any;
    onBlur: () => void;
  };
}

export default FieldReact;
