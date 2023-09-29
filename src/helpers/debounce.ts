export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
): ((...args: Parameters<T>) => () => void) => {
    let timeoutId: NodeJS.Timeout;

    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
        return () => {
            clearTimeout(timeoutId);
        };
    };
};
