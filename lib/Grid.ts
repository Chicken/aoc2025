import { Cell, type CellEquivalent } from "./Cell.ts";

// TODO: mutable methods
export class Grid<TValue> {
    public rows: TValue[][];

    constructor(string: TValue extends string ? TValue : never);
    constructor(initialValues: TValue[][]);
    constructor(height: number, width: number, initialValue?: TValue);
    constructor(arg1: TValue[][] | string | number, arg2?: number, arg3?: TValue) {
        if (typeof arg1 === "number") {
            this.rows = new Array(arg1).fill(null).map(() => new Array(arg2!).fill(structuredClone(arg3)));
        } else if (typeof arg1 === "string") {
            this.rows = arg1.split("\n").map((l) => l.split("")) as TValue[][];
        } else {
            this.rows = arg1;
        }
    }

    get height() {
        return this.rows.length;
    }

    get width() {
        return this.rows[0]?.length ?? 0;
    }

    get(r: number, c: number): TValue | null;
    get(cell: CellEquivalent): TValue | null;
    get(arg1: number | CellEquivalent, arg2?: number): TValue | null {
        if (typeof arg1 === "number") return this.rows[arg1][arg2!];
        else {
            const cell = Cell.resolveEquivalent(arg1);
            return this.rows[cell.r]?.[cell.c] ?? null;
        }
    }

    set(r: number, c: number, value: TValue): void;
    set(cell: CellEquivalent, value: TValue): void;
    set(arg1: number | CellEquivalent, arg2: TValue | number, arg3?: TValue) {
        if (typeof arg1 === "number") this.rows[arg1][arg2 as number] = arg3!;
        else {
            const cell = Cell.resolveEquivalent(arg1);
            this.rows[cell.r][cell.c] = arg2 as TValue;
        }
    }

    getRow(r: number) {
        return this.rows[r];
    }

    getColumn(c: number) {
        return this.rows.map((row) => row[c]);
    }

    toString(transform: (v: TValue) => string = (v) => String(v)) {
        return this.rows.map((row) => row.map(transform).join("")).join("\n");
    }

    indexOf(value: TValue) {
        for (let r = 0; r < this.height; r++) {
            const c = this.rows[r].indexOf(value);
            if (c !== -1) return new Cell(r, c);
        }
        return null;
    }

    has(r: number, c: number): boolean;
    has(cell: CellEquivalent): boolean;
    has(arg1: number | CellEquivalent, arg2?: number): boolean {
        if (typeof arg1 === "number") return arg1 >= 0 && arg1 < this.height && arg2! >= 0 && arg2! < this.width;
        else {
            const cell = Cell.resolveEquivalent(arg1);
            return cell.r >= 0 && cell.r < this.height && cell.c >= 0 && cell.c < this.width;
        }
    }

    getQuadrant(cell: Cell) {
        const midR = this.height / 2 - 0.5;
        const midC = this.width / 2 - 0.5;
        if (cell.r < midR) {
            if (cell.c < midC) return Cell.UP_LEFT;
            else if (cell.c > midC) return Cell.UP_RIGHT;
        } else if (cell.r > midR) {
            if (cell.c < midC) return Cell.DOWN_LEFT;
            else if (cell.c > midC) return Cell.DOWN_RIGHT;
        }
        return null;
    }

    *[Symbol.iterator]() {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                yield [new Cell(r, c), this.rows[r][c]] as const;
            }
        }
    }

    neighbours(cell: Cell, includeDiagonals = false) {
        return cell.neighbours(includeDiagonals).filter((c) => this.has(c));
    }

    equals(other: Grid<TValue>) {
        if (this.height !== other.height || this.width !== other.width) return false;
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                if (this.rows[r][c] !== other.rows[r][c]) return false;
            }
        }
        return true;
    }

    map<TMappedValue>(
        mapFn: (cell: Cell, value: TValue, originalGrid: Grid<TValue>) => TMappedValue,
    ): Grid<TMappedValue> {
        return new Grid(this.rows.map((row, r) => row.map((v, c) => mapFn(new Cell(r, c), v, this))));
    }

    copy() {
        return new Grid(structuredClone(this.rows));
    }

    transpose() {
        const transposed = new Array(this.width).fill(null).map(() => new Array<TValue>(this.height));
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                transposed[c][r] = this.rows[r][c];
            }
        }
        return new Grid(transposed);
    }

    /**
     * You dumb frick.
     * Horizontally means in <---> this way.
     * So
     * ```
     * a b c
     * d e f
     * ```
     * becomes
     * ```
     * c b a
     * f e d
     * ```
     */
    flipHorizontally() {
        return new Grid(this.rows.map((row) => row.map((cell) => structuredClone(cell)).reverse()));
    }

    /**
     * You dumb frick.
     * Vertically means in ^v this way.
     * So
     * ```
     * a b c
     * d e f
     * ```
     * becomes
     * ```
     * d e f
     * a b c
     * ```
     */
    flipVertically() {
        return new Grid(this.rows.map((row) => structuredClone(row)).reverse());
    }

    rotateRight90() {
        return this.transpose().flipHorizontally();
    }

    rotateClockwise() {
        return this.rotateRight90();
    }

    rotateLeft90() {
        return this.transpose().flipVertically();
    }

    rotateCounterClockwise() {
        return this.rotateLeft90();
    }

    rotate180() {
        return this.flipHorizontally().flipVertically();
    }

    rotate(deg: number) {
        deg = (deg % 360 + 360) % 360;
        if (deg % 90 !== 0) throw new Error("Can only rotate by multiples of 90 degrees.");
        if (deg === 90) return this.rotateRight90();
        if (deg === 180) return this.rotate180();
        if (deg === 270) return this.rotateLeft90();
        return this.copy();
    }
}
