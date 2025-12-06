import { product, sum } from "@/array.ts";
import { ints } from "@/string.ts";

const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim());

const ops = input.at(-1)!.split(" ").filter(Boolean);
const rows = input.slice(0, -1).map((l) => ints(l));

let total = 0;

for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const numbers = rows.map((r) => r[i]);
    total += op === "+" ? sum(numbers) : product(numbers);
}

console.log(total);
