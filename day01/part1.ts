import { mod } from "@/numbers.ts";

const input = Deno.readTextFileSync("input").trim().split("\n").map((l) =>
    [l[0], parseInt(l.slice(1), 10)] as [string, number]
);

let zeros = 0;
let current = 50;

for (const [d, n] of input) {
    current = mod(current + (d === "R" ? n : -n), 100);
    if (current === 0) zeros++;
}

console.log(zeros);
