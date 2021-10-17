import Form from './form';
export declare type Listener = (field: Field) => void;
declare class Field {
    value: any;
    touched: boolean;
    error: string;
    name: string;
    getForm: () => Form;
    listeners: Listener[];
    constructor({ name, value, touched, error, getForm, }: {
        name: string;
        value: any;
        touched?: boolean;
        error?: string;
        getForm: () => Form;
    });
    setError(error: string): void;
    setTouched(touched: boolean): void;
    set(value: any): void;
    validate(): Promise<void>;
    onChange: (event: {
        target: {
            value: string;
        };
    }) => void;
    onBlur: () => void;
    getInputField: () => {
        value: any;
        name: string;
        onChange: (event: {
            target: {
                value: string;
            };
        }) => void;
        onBlur: () => void;
    };
    getSelectField: () => {
        value: any;
        name: string;
        onChange: (value: any) => void;
        onBlur: () => void;
    };
    triggerListeners(): void;
}
export default Field;
