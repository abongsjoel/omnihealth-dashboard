import { useCallback, useState } from "react";
import { getValidationError } from "../utils/utils";

interface UseInputReturn {
    value: string;
    error?: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useInput(
    defaultValue: string,
): UseInputReturn {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string>();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValue(value);

        if (error) {
            const err = getValidationError(name, value);
            setError(err)
        }
    }, [error]);

    const handleBlur = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const err = getValidationError(name, value);
            setError(err)
        },
        []
    );

    return {
        value,
        error,
        handleChange,
        handleBlur,
    };
}