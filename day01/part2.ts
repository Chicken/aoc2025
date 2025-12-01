import { mod } from "@/numbers.ts";

const input = Deno.readTextFileSync("input").trim().split("\n").map((l) =>
    [l[0], parseInt(l.slice(1), 10)] as [string, number]
);

let zeros = 0;
let current = 50;

for (let [d, n] of input) {
    if (n >= 100) {
        zeros += Math.floor(n / 100);
        n = mod(n, 100);
    }
    if (d === "R" && current + n >= 100) zeros++;
    if (d === "L" && current != 0 && current - n <= 0) zeros++;
    current = mod(current + (d === "R" ? n : -n), 100);
}

console.log(zeros);
