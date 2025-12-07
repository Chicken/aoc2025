import { Cell } from "@/Cell.ts";
import { memoize } from "@/function.ts";
import { Grid } from "@/Grid.ts";
import { CellSet } from "@/Set.ts";

const grid = new Grid(Deno.readTextFileSync("input").trim());
const hit = new CellSet();

const propagate = memoize((cell: Cell) => {
    while (true) {
        cell = cell.down();
        const val = grid.get(cell);
        if (!val) break;
        if (val === "^") {
            hit.add(cell);
            propagate(cell.left());
            propagate(cell.right());
            break;
        }
    }
});

propagate(grid.indexOf("S")!);
console.log(hit.size);
