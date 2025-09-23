

import React from 'react'

interface UseDebounceProps {
    value: string;
    delay?: number;
}

export default function useDebounce({ value, delay = 500 }: UseDebounceProps) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
