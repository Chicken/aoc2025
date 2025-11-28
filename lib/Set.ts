import { Cell } from "./Cell.ts";
import { CoordString, Point2D } from "./Point.ts";

class EncodedSet<TVal, TKey extends string> extends Set<TKey> {
    encode(val: TVal): TKey {
        return val as unknown as TKey;
    }

    decode(key: TKey): TVal {
        return key as unknown as TVal;
    }

    copy(): EncodedSet<TVal, TKey> {
        const copy = new EncodedSet<TVal, TKey>();
        for (const key of this) {
            copy.add(key);
        }
        return copy;
    }

    // @ts-expect-error - ts override is bad
    override has(val: TVal): boolean {
        return super.has(this.encode(val));
    }

    // @ts-expect-error - ts override is bad
    override add(val: TVal): this {
        return super.add(this.encode(val));
    }

    // @ts-expect-error - ts override is bad
    override delete(val: TVal): boolean {
        return super.delete(this.encode(val));
    }

    // @ts-expect-error - ts override is bad
    override *[Symbol.iterator]() {
        for (const key of super[Symbol.iterator]()) {
            yield this.decode(key);
        }
    }
}

export class Point2DSet extends EncodedSet<Point2D, CoordString> {
    override encode(point: Point2D): CoordString {
        return point.key;
    }

    override decode(str: CoordString): Point2D {
        return new Point2D(str);
    }
}

export class CellSet extends EncodedSet<Cell, CoordString> {
    override encode(cell: Cell): CoordString {
        return cell.key;
    }

    override decode(str: CoordString): Cell {
        return new Cell(str);
    }
}
