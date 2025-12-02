import { max, min, sortAsc } from "./array.ts";

export type RangeEquivalent = Range | [number, number];

export class Range {
    public start: number;
    public end: number;

    constructor(start: number, end: number);
    constructor(range: Range);
    constructor(tuple: [number, number]);
    constructor(arg1: number | Range | [number, number], arg2?: number) {
        if (typeof arg1 === "number") {
            this.start = arg1;
            this.end = arg2!;
        } else if (arg1 instanceof Range) {
            this.start = arg1.start;
            this.end = arg1.end;
        } else {
            this.start = arg1[0];
            this.end = arg1[1];
        }
    }

    toString(): string {
        return `${this.start}->${this.end}`;
    }

    copy() {
        return new Range(this.start, this.end);
    }

    static resolveEquivalent(range: RangeEquivalent): Range {
        if (range instanceof Range) return range;
        else return new Range(range);
    }

    get length() {
        return this.end - this.start;
    }

    isValid() {
        return this.length < 0;
    }

    equals(other: RangeEquivalent) {
        const otherRange = Range.resolveEquivalent(other);
        return this.start === otherRange.start && this.end === otherRange.end;
    }

    has(n: number) {
        return this.start <= n && n <= this.end;
    }

    contains(other: RangeEquivalent) {
        const otherRange = Range.resolveEquivalent(other);
        return this.start <= otherRange.start && otherRange.end <= this.end;
    }

    intersects(other: RangeEquivalent) {
        const otherRange = Range.resolveEquivalent(other);
        return this.start <= otherRange.end && otherRange.start <= this.end;
    }

    intersection(other: RangeEquivalent) {
        const otherRange = Range.resolveEquivalent(other);
        if (!this.intersects(otherRange)) return null;
        return new Range(
            Math.max(this.start, otherRange.start),
            Math.min(this.end, otherRange.end)
        );
    }

    union(other: RangeEquivalent) {
        const otherRange = Range.resolveEquivalent(other);
        if (!this.intersects(otherRange)) return null;
        return new Range(
            Math.min(this.start, otherRange.start),
            Math.max(this.end, otherRange.end)
        );
    }

    remove(other: RangeEquivalent): Range[] {
        const otherRange = Range.resolveEquivalent(other);
        if (!this.intersects(otherRange)) return [this.copy()];
        if (otherRange.contains(this)) return [];
        if (this.contains(otherRange)) {
            return [
                new Range(this.start, otherRange.start),
                new Range(otherRange.end, this.end),
            ].filter((r) => r.length > 0);
        }
        if (this.start < otherRange.start) return [new Range(this.start, otherRange.start)];
        if (this.end > otherRange.end) return [new Range(otherRange.end, this.end)];
        throw new Error("unreachable");
    }

    *iterate(stepSize = 1) {
        for (let i = this.start; i < this.end; i += stepSize) yield i;
    }

    [Symbol.iterator]() {
        return this.iterate();
    }
}

export class RangeSet {
    public ranges: Range[];

    constructor(ranges: Range[] = []) {
        this.ranges = [];
        for (const range of ranges) this.add(range);
    }

    /**
     * amount of ranges
     */
    get count() {
        return this.ranges.length;
    }

    /**
     * total length of all ranges
     */
    get size() {
        return this.ranges.reduce((acc, r) => acc + r.length, 0);
    }

    copy() {
        return new RangeSet(this.ranges.map((range) => range.copy()));
    }

    toString() {
        return (
            "{ " +
            sortAsc(this.ranges, (r) => r.start)
                .map((range) => range.toString())
                .join(", ") +
            " }"
        );
    }

    bounds() {
        if (this.ranges.length === 0) return null;
        return new Range(min(this.ranges.map((r) => r.start)), max(this.ranges.map((r) => r.end)));
    }

    add(range: RangeEquivalent) {
        const newRange = Range.resolveEquivalent(range);
        const intersections = this.ranges.filter((r) => r.intersects(newRange));
        const merged = intersections.reduce((acc, r) => acc.union(r)!, newRange);
        this.ranges = this.ranges.filter((r) => !intersections.includes(r));
        this.ranges.push(merged);
    }

    merge(other: RangeSet) {
        for (const range of other.ranges) this.add(range);
    }

    remove(range: RangeEquivalent) {
        const removed = Range.resolveEquivalent(range);
        const intersections = this.ranges.filter((r) => r.intersects(removed));
        const newRanges = intersections.flatMap((r) => r.remove(removed));
        this.ranges = this.ranges.filter((r) => !intersections.includes(r));
        this.ranges.push(...newRanges);
    }

    has(n: number) {
        return this.ranges.some((r) => r.has(n));
    }

    intersects(other: RangeSet) {
        for (const r1 of this.ranges) {
            for (const r2 of other.ranges) {
                if (r1.intersects(r2)) return true;
            }
        }
    }

    intersection(other: RangeSet) {
        const newRanges: Range[] = [];
        for (const r1 of this.ranges) {
            for (const r2 of other.ranges) {
                if (r1.intersects(r2)) newRanges.push(r1.intersection(r2)!);
            }
        }
        return new RangeSet(newRanges);
    }

    inverse() {
        const ranges = [];
        sortAsc(this.ranges, (r) => r.start);
        let x = null;
        for (const range of this.ranges) {
            if (x != null) {
                ranges.push(new Range(x, range.start));
            }
            x = range.end;
        }
        return new RangeSet(ranges);
    }
}
