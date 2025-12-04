import { Grid } from "@/Grid.ts";

const grid = new Grid(Deno.readTextFileSync("input").trim());

let sum = 0;

for (const [cell, value] of grid) {
    if (value === ".") continue;
    if (grid.neighbours(cell, true).filter((c) => grid.get(c) === "@").length < 4) sum++;
}

console.log(sum);
