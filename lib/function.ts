// deno-lint-ignore no-explicit-any
type AnyFn = (...args: any[]) => any;
export function memoize<TFn extends AnyFn>(
    fn: TFn,
    keyFactory: (...params: Parameters<TFn>) => string = (...args) => args.map(String).join(","),
): TFn {
    const cache = new Map<string, ReturnType<TFn>>();
    return ((...args: Parameters<TFn>) => {
        const key = keyFactory(...args);
        if (cache.has(key)) return cache.get(key)!;
        const result = fn(...args) as ReturnType<TFn>;
        cache.set(key, result);
        return result;
    }) as TFn;
}
