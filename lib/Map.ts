import { Cell } from "./Cell.ts";
import { CoordString, Point2D } from "./Point.ts";

class EncodedMap<TKey, TVal, TRawKey extends string> extends Map<TRawKey, TVal> {
    encodeKey(key: TKey): TRawKey {
        return key as unknown as TRawKey;
    }

    decodeKey(rawKey: TRawKey): TKey {
        return rawKey as unknown as TKey;
    }

    // @ts-expect-error - ts override is bad
    override get(key: TKey): TVal | undefined {
        return super.get(this.encodeKey(key));
    }

    // @ts-expect-error - ts override is bad
    override set(key: TKey, val: TVal): this {
        return super.set(this.encodeKey(key), val);
    }

    // @ts-expect-error - ts override is bad
    override has(key: TKey): boolean {
        return super.has(this.encodeKey(key));
    }

    // @ts-expect-error - ts override is bad
    override delete(key: TKey): boolean {
        return super.delete(this.encodeKey(key));
    }

    // @ts-expect-error - ts override is bad
    override *[Symbol.iterator]() {
        for (const [rawKey, val] of super[Symbol.iterator]()) {
            yield [this.decodeKey(rawKey), val];
        }
    }

    // @ts-expect-error - ts override is bad
    override keys(): IterableIterator<TKey> {
        return super.keys().map((rawKey) => this.decodeKey(rawKey));
    }

    // @ts-expect-error - ts override is bad
    override entries(): MapIterator<[TKey, TVal]> {
        return super.entries().map(([rawKey, val]) => [this.decodeKey(rawKey), val]);
    }

}

export class Point2DMap<TVal> extends EncodedMap<Point2D, TVal, CoordString> {
    override encodeKey(point: Point2D): CoordString {
        return point.key;
    }

    override decodeKey(str: CoordString): Point2D {
        return new Point2D(str);
    }
}


export class CellMap<TVal> extends EncodedMap<Cell, TVal, CoordString> {
    override encodeKey(cell: Cell): CoordString {
        return cell.key;
    }

    override decodeKey(str: CoordString): Cell {
        return new Cell(str);
    }
}
