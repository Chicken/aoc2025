import type { Grid } from "./Grid.ts";
import { CoordString, CoordTuple, Point2D } from "./Point.ts";

export type CellEquivalent = Cell | CoordTuple;

// TODO: mutable methods
/**
 * Almost equivalent to Point2D, just with `R, C` coordinates. Positive towards down right.
 * Used for grids. Includes some extra utils.
 */
export class Cell {
    public r: number;
    public c: number;

    constructor(r: number, c: number);
    constructor(cell: Cell);
    constructor(point: Point2D);
    constructor(tuple: CoordTuple);
    constructor(key: CoordString);
    constructor(arg1: number | Cell | Point2D | CoordTuple | CoordString, arg2?: number) {
        if (typeof arg1 === "number") {
            this.r = arg1;
            this.c = arg2!;
        } else if (arg1 instanceof Cell) {
            this.r = arg1.r;
            this.c = arg1.c;
        } else if (arg1 instanceof Point2D) {
            this.r = arg1.y;
            this.c = arg1.x;
        } else if (typeof arg1 == "string") {
            const [r, c] = arg1.split(",").map(Number);
            this.r = r;
            this.c = c;
        } else {
            this.r = arg1[0];
            this.c = arg1[1];
        }
    }

    toString(): CoordString {
        return `${this.r},${this.c}`;
    }

    get key() {
        return this.toString();
    }

    copy() {
        return new Cell(this.r, this.c);
    }

    isIn(grid: Grid<unknown>) {
        return grid.has(this);
    }

    static resolveEquivalent(cell: CellEquivalent): Cell {
        if (cell instanceof Cell) return cell;
        else return new Cell(cell);
    }

    add(other: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(other);
        return new Cell(this.r + otherCell.r, this.c + otherCell.c);
    }

    sub(other: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(other);
        return new Cell(this.r - otherCell.r, this.c - otherCell.c);
    }

    scale(scalar: number) {
        return new Cell(this.r * scalar, this.c * scalar);
    }

    div(scalar: number) {
        return new Cell(this.r / scalar, this.c / scalar);
    }

    get length() {
        return Math.sqrt(this.r ** 2 + this.c ** 2);
    }

    normalize() {
        return this.div(this.length);
    }

    product(other: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(other);
        return this.r * otherCell.r + this.c * otherCell.c;
    }

    dot(other: CellEquivalent) {
        return this.product(other);
    }

    mul(scalar: number): Cell;
    mul(cell: CellEquivalent): number;
    mul(arg1: number | CellEquivalent): Cell | number {
        if (typeof arg1 === "number") return this.scale(arg1);
        else return this.product(arg1);
    }

    mod(other: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(other);
        return new Cell((this.r + otherCell.r) % otherCell.r, (this.c + otherCell.c) % otherCell.c);
    }

    equals(cell: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(cell);
        return this.r === otherCell.r && this.c === otherCell.c;
    }

    distance(cell: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(cell);
        return Math.sqrt((this.r - otherCell.r) ** 2 + (this.c - otherCell.c) ** 2);
    }

    manhattanDistance(cell: CellEquivalent) {
        const otherCell = Cell.resolveEquivalent(cell);
        return Math.abs(this.r - otherCell.r) + Math.abs(this.c - otherCell.c);
    }

    negate() {
        return new Cell(-this.r, -this.c);
    }

    abs() {
        return new Cell(Math.abs(this.r), Math.abs(this.c));
    }

    reverse() {
        return new Cell(this.c, this.r);
    }

    neighbours(includeDiagonals = false) {
        const deltas = includeDiagonals ? Cell.ALL_DIRECTIONS : Cell.DIRECTIONS;
        return deltas.map((d) => this.add(d));
    }

    rotate(deg: number) {
        const rad = (deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return new Cell(this.r * cos - this.c * sin, this.r * sin + this.c * cos);
    }

    rotateRight90() {
        return new Cell(this.c, -this.r);
    }

    rotateLeft90() {
        return new Cell(-this.c, this.r);
    }

    rotate180() {
        return this.negate();
    }

    up(n = 1) {
        return this.add(Cell.UP.scale(n));
    }

    down(n = 1) {
        return this.add(Cell.DOWN.scale(n));
    }

    left(n = 1) {
        return this.add(Cell.LEFT.scale(n));
    }

    right(n = 1) {
        return this.add(Cell.RIGHT.scale(n));
    }

    upLeft(n = 1) {
        return this.add(Cell.UP_LEFT.scale(n));
    }

    upRight(n = 1) {
        return this.add(Cell.UP_RIGHT.scale(n));
    }

    downLeft(n = 1) {
        return this.add(Cell.DOWN_LEFT.scale(n));
    }

    downRight(n = 1) {
        return this.add(Cell.DOWN_RIGHT.scale(n));
    }

    static get ZERO() {
        return new Cell(0, 0);
    }

    static get UP() {
        return new Cell(-1, 0);
    }

    static get DOWN() {
        return new Cell(1, 0);
    }

    static get LEFT() {
        return new Cell(0, -1);
    }

    static get RIGHT() {
        return new Cell(0, 1);
    }

    static get UP_LEFT() {
        return new Cell(-1, -1);
    }

    static get UP_RIGHT() {
        return new Cell(-1, 1);
    }

    static get DOWN_LEFT() {
        return new Cell(1, -1);
    }

    static get DOWN_RIGHT() {
        return new Cell(1, 1);
    }

    static get DIRECTIONS() {
        return [Cell.UP, Cell.DOWN, Cell.LEFT, Cell.RIGHT];
    }

    static get DIAGONALS() {
        return [Cell.UP_LEFT, Cell.UP_RIGHT, Cell.DOWN_LEFT, Cell.DOWN_RIGHT];
    }

    static get ALL_DIRECTIONS() {
        return [...Cell.DIRECTIONS, ...Cell.DIAGONALS];
    }
}
