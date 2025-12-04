import { Grid } from "@/Grid.ts";

let grid = new Grid(Deno.readTextFileSync("input").trim());

let sum = 0;

while (true) {
    let changed = false;
    const newGrid = grid.copy();
    for (const [cell, value] of grid) {
        if (value === ".") continue;
        if (grid.neighbours(cell, true).filter((c) => grid.get(c) === "@").length < 4) {
            sum++;
            newGrid.set(cell, ".");
            changed = true;
        }
    }
    grid = newGrid;
    if (!changed) break;
}

console.log(sum);
