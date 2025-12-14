import { sum } from "@/array.ts";
import { ints } from "@/string.ts";

const rawInput = Deno.readTextFileSync("input").trim().split("\n\n");

const input = rawInput.pop()!.split("\n").map((l) => {
    const [w, h, ...presents] = ints(l);
    return {
        grid: { w, h },
        presents,
    };
});

const sizes = rawInput.map((b) => b.match(/#/g)!.length);

let ans = 0;
for (const part of input) ans += Number(part.grid.w * part.grid.h >= sum(part.presents.map((p, i) => p * sizes[i])));
console.log(ans);
