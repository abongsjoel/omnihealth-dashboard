import { useCallback, useState } from "react";
import { formatField } from "../utils/utils";
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

        if (!error && value === "") {
            setError(`${formatField(name)} is required`);
        } else {
            setError(undefined);
        }
    }, [error]);

    const handleBlur = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            if (value === "") {
                setError(`${formatField(name)} is required`);
            }
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