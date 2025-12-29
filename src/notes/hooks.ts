import { useState } from "react";

/**
 * Hook that returns a debounce function. The debounce function waits `delayMs`
 * before executing the passed in procedure when invoked. If the debounce
 * function is called again before `delayMs` time is up, the previous
 * invocation is cancelled and replaced with the new invocation.
 */
export function useDebounce(delayMs: number) {
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    function debounce(procedure: () => void) {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout)
        }
        const timeout = setTimeout(() => {
            procedure();
        }, delayMs);
        setDebounceTimeout(timeout);
    }

    return debounce;
}
