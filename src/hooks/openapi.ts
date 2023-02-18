import {FieldValues, SubmitErrorHandler, SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {UseFormProps} from "react-hook-form/dist/types";
import {CancelablePromise} from "../openapi";


export const useApi = <T>() => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any | undefined>();
    const [result, setResult] = useState<T | undefined>();
    return {
        loading,
        error,
        result,
        query: async (q: () => CancelablePromise<T>) => {
            try {
                setError(undefined);
                setLoading(true);
                let res = await q();
                setResult(res);
                return res;
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }
    }
}

export const useApiForm = <FV extends FieldValues, TContext>(props?: UseFormProps<FV, TContext>) => {
    const [submitErr, setSubmitErr] = useState<unknown>(undefined);
    const [invalidSubmitErr, setInvalidSubmitErr] = useState<unknown>(undefined);
    const {handleSubmit, ...formArgs} = useForm<FV>(props);

    let errTriedHandleSubmit = (
        onValid: SubmitHandler<FV>,
        apiErrCallback?: (err: unknown) => void,
        invalidErrCallback?: (err: unknown) => void,
        onInvalid?: SubmitErrorHandler<FV>
    ) => handleSubmit(
        async (...args) => {
            try {
                return await Promise.resolve(onValid(...args));
            } catch (e) {
                setSubmitErr(e);
                apiErrCallback?.(e);
            }
        },
        onInvalid && (async (...args) => {
            try {
                return await Promise.resolve(onInvalid(...args));
            } catch (e) {
                setInvalidSubmitErr(e);
                invalidErrCallback?.(e);
            }
        })
    );

    return {
        ...formArgs,
        apiErr: submitErr,
        invalidErr: invalidSubmitErr,
        handleSubmit: errTriedHandleSubmit,
        clearApiErr: () => setSubmitErr(undefined),
        clearInvalidErr: () => setInvalidSubmitErr(undefined)
    }
}
