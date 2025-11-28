import { Cell } from "./Cell.ts";

export type CoordTuple = [number, number];
export type CoordString = `${number},${number}`;

export type Point2DEquivalent = Point2D | CoordTuple;

// TODO: mutable methods
/**
 * A point in 2D space, also know as a vector. `X, Y` coordinates. Positive towards up right.
 */
export class Point2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number);
    constructor(point: Point2D);
    constructor(cell: Cell);
    constructor(tuple: CoordTuple);
    constructor(key: CoordString);
    constructor(arg1: number | Point2D | Cell | CoordTuple | CoordString, arg2?: number) {
        if (typeof arg1 === "number") {
            this.x = arg1;
            this.y = arg2!;
        } else if (arg1 instanceof Point2D) {
            this.x = arg1.x;
            this.y = arg1.y;
        } else if (arg1 instanceof Cell) {
            this.x = arg1.c;
            this.y = arg1.r;
        } else if (typeof arg1 == "string") {
            const [x, y] = arg1.split(",").map(Number);
            this.x = x;
            this.y = y;
        } else {
            this.x = arg1[0];
            this.y = arg1[1];
        }
    }

    toString(): CoordString {
        return `${this.x},${this.y}`;
    }

    get key() {
        return this.toString();
    }

    copy() {
        return new Point2D(this.x, this.y);
    }

    static resolveEquivalent(point: Point2DEquivalent): Point2D {
        if (point instanceof Point2D) return point;
        else return new Point2D(point);
    }

    add(other: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(other);
        return new Point2D(this.x + otherPoint.x, this.y + otherPoint.y);
    }

    sub(other: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(other);
        return new Point2D(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    scale(scalar: number) {
        return new Point2D(this.x * scalar, this.y * scalar);
    }

    div(scalar: number) {
        return new Point2D(this.x / scalar, this.y / scalar);
    }

    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        return this.div(this.length);
    }

    product(other: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(other);
        return this.x * otherPoint.x + this.y * otherPoint.y;
    }

    dot(other: Point2DEquivalent) {
        return this.product(other);
    }

    mul(scalar: number): Point2D;
    mul(point: Point2DEquivalent): number;
    mul(arg1: number | Point2DEquivalent): Point2D | number {
        if (typeof arg1 === "number") return this.scale(arg1);
        else return this.product(arg1);
    }

    mod(other: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(other);
        return new Point2D(
            (this.x % otherPoint.x + otherPoint.x) % otherPoint.x,
            (this.y % otherPoint.y + otherPoint.y) % otherPoint.y,
        );
    }

    equals(point: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(point);
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    distance(point: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(point);
        return Math.sqrt((this.x - otherPoint.x) ** 2 + (this.y - otherPoint.y) ** 2);
    }

    manhattanDistance(point: Point2DEquivalent) {
        const otherPoint = Point2D.resolveEquivalent(point);
        return Math.abs(this.x - otherPoint.x) + Math.abs(this.y - otherPoint.y);
    }

    negate() {
        return new Point2D(-this.x, -this.y);
    }

    abs() {
        return new Point2D(Math.abs(this.x), Math.abs(this.y));
    }

    reverse() {
        return new Point2D(this.y, this.x);
    }

    rotate(deg: number) {
        const rad = deg * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return new Point2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    rotateRight90() {
        return new Point2D(this.y, -this.x);
    }

    rotateLeft90() {
        return new Point2D(-this.y, this.x);
    }

    rotate180() {
        return this.negate();
    }

    static get ZERO() {
        return new Point2D(0, 0);
    }

    static get UP() {
        return new Point2D(0, 1);
    }

    static get DOWN() {
        return new Point2D(0, -1);
    }

    static get LEFT() {
        return new Point2D(-1, 0);
    }

    static get RIGHT() {
        return new Point2D(1, 0);
    }

    static get UP_LEFT() {
        return new Point2D(-1, 1);
    }

    static get UP_RIGHT() {
        return new Point2D(1, 1);
    }

    static get DOWN_LEFT() {
        return new Point2D(-1, -1);
    }

    static get DOWN_RIGHT() {
        return new Point2D(1, -1);
    }

    static get DIRECTIONS() {
        return [Point2D.UP, Point2D.DOWN, Point2D.LEFT, Point2D.RIGHT];
    }

    static get DIAGONALS() {
        return [Point2D.UP_LEFT, Point2D.UP_RIGHT, Point2D.DOWN_LEFT, Point2D.DOWN_RIGHT];
    }

    static get ALL_DIRECTIONS() {
        return [...Point2D.DIRECTIONS, ...Point2D.DIAGONALS];
    }
}
