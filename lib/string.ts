export function ints(str: string): number[] {
    return str.match(/-?\d+/g)?.map(Number) ?? [];
}
