import Field, { Listener } from './field';
export declare type FormProps = {
    initValues: Record<string, any>;
    validateSchema: any;
    options: {
        validateOnChange: boolean;
        validateOnBlur: boolean;
    };
};
declare class Form {
    options: {
        validateOnChange: boolean;
        validateOnBlur: boolean;
    };
    fields: Record<string, Field>;
    f: Record<string, Field>;
    validateSchema: any;
    globalListeners: Listener[];
    globalFieldListener: (field: Field) => void;
    constructor({ initValues, validateSchema, options }: FormProps);
    _addGlobalListener(listener: Listener): void;
    _removeGlobalListener(listener: Listener): void;
    _addField(name: string, field: Field): void;
    getValues(): {};
}
export default Form;
