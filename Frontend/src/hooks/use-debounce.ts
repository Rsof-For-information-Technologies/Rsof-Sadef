import { useEffect, useState } from 'react'


type UseDebounceProps <T> = {
    value: T;
    delay: number;
    debounceFuntion:  (value: T, signal?: AbortSignal) => any;
}

function useDebounce<T>({ value, delay = 500, debounceFuntion }: UseDebounceProps<T>) {

    const [debouncedValue, setDebouncedValue] = useState(value)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const timeOut = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timeOut)
            setLoading(false)
        }

    }, [delay, value])

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        setLoading(true)
        debounceFuntion(debouncedValue, signal)?.then(() => setLoading(false))


        return () => {
            controller.abort()
            setLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

    return [loading]
}

export default useDebounce