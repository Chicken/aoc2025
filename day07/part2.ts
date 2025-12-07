import { Cell } from "@/Cell.ts";
import { memoize } from "@/function.ts";
import { Grid } from "@/Grid.ts";

const grid = new Grid(Deno.readTextFileSync("input").trim());

const propagate = memoize((cell: Cell): number => {
    while (true) {
        cell = cell.down();
        const val = grid.get(cell);
        if (!val) return 1;
        if (val === "^") return propagate(cell.left()) + propagate(cell.right());
    }
});

console.log(propagate(grid.indexOf("S")!));
