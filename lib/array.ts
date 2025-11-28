export function sum(arr: Iterable<number>) {
    return [...arr].reduce((acc, val) => acc + val, 0);
}

export function product(arr: Iterable<number>) {
    return [...arr].reduce((acc, val) => acc * val, 1);
}

export function max(arr: Iterable<number>) {
    return Math.max(...arr);
}

export function min(arr: Iterable<number>) {
    return Math.min(...arr);
}

export function freq<TEl>(arr: TEl[]) {
    return arr.reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map<TEl, number>());
}

export function dedup(arr: Iterable<number>) {
    return [...new Set(arr)];
}

export const groupBy = Object.groupBy.bind(Object);

/**
 * 1, 2, 3, ...
 */
export function sortAsc<TEl = number>(arr: TEl[], extract: (el: TEl) => number = (el: TEl) => el as number) {
    return arr.sort((a, b) => extract(a) - extract(b));
}

/**
 * 3, 2, 1, ...
 */
export function sortDesc<TEl = number>(arr: TEl[], extract: (el: TEl) => number = (el: TEl) => el as number) {
    return arr.sort((a, b) => extract(b) - extract(a));
}

export function* windows<TEl>(arr: TEl[], length: number, step = 1) {
    for (let i = 0; i < arr.length - length + 1; i += step) {
        yield arr.slice(i, i + length);
    }
}

export function* permutations<TEl>(arr: TEl[], length: number): Generator<TEl[]> {
    if (length === 1) {
        yield* arr.map((el) => [el]);
        return;
    }
    for (const [i, el] of arr.entries()) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        for (const perm of permutations(rest, length - 1)) {
            yield [el, ...perm];
        }
    }
}

export function* combinations<TEl>(arr: TEl[], length: number): Generator<TEl[]> {
    if (length === 1) {
        yield* arr.map((el) => [el]);
        return;
    }
    if (length === arr.length) {
        yield arr;
        return;
    }
    for (const [i, el] of arr.entries()) {
        const rest = arr.slice(i + 1);
        for (const comb of combinations(rest, length - 1)) {
            yield [el, ...comb];
        }
    }
}

export function pairs<TEl>(arr: TEl[]) {
    return combinations(arr, 2);
}
