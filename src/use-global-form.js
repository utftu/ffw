import { useMemo } from 'react';
import Form from './form';
function useGlobalForm(options) {
    return useMemo(() => {
        return new Form(options);
    }, []);
}
export default useGlobalForm;
