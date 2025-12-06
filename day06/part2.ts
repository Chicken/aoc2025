import { product, sum } from "@/array.ts";
import { Grid } from "@/Grid.ts";

const input = new Grid(Deno.readTextFileSync("input").split("\n").filter(Boolean).join("\n")).transpose().toString()
    .split("\n").map((l) => l.trim()).join("\n").split("\n\n");

let total = 0;

for (const calc of input) {
    const numbers = calc.split("\n").map((l) => parseInt(l, 10));
    total += calc.split("\n")[0].at(-1)! === "+" ? sum(numbers) : product(numbers);
}

console.log(total);

/*
import { product, sum } from "@/array.ts";

const input = Deno.readTextFileSync("input").split("\n").filter(Boolean);

let total = 0;
const ops = input.at(-1)!;
let numbers: number[] = [];
let lastOp = "";

for (let i = 0; i < ops.length; i++) {
    const op = ops[i].trim();
    if (op) {
        if (lastOp) {
            total += lastOp === "+" ? sum(numbers) : product(numbers);
            numbers = [];
        }
        lastOp = op;
    }
    const str = input.slice(0, -1).map((l) => l[i]).filter(Boolean).join("").trim();
    if (str) numbers.push(parseInt(str, 10));
}
total += lastOp === "+" ? sum(numbers) : product(numbers);

console.log(total);
*/
