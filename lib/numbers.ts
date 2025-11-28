export function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

/**
 * @returns [quotient, remainder]
 */
export function divmod(a: number, b: number): [number, number] {
    return [Math.floor(a / b), mod(a, b)];
}

export function gcd(a: number, b: number): number {
    while (b) [a, b] = [b, a % b];
    return a;
}

export function gcdArray(arr: number[]): number {
    return arr.reduce(gcd, 0);
}

export function lcm(a: number, b: number): number {
    return a * b / gcd(a, b);
}

export function lcmArray(arr: number[]): number {
    return arr.reduce(lcm, 1);
}

export function isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}
