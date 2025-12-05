import { Range } from "@/Range.ts";

const input = Deno.readTextFileSync("input").trim().split(",")
    .map((p) => new Range(...p.split("-").map(Number) as [number, number]));

let sum = 0;

for (const range of input) {
    for (const id of range) {
        const str = id.toString();
        if (str.length % 2 === 0 && str.slice(0, str.length / 2) === str.slice(str.length / 2)) sum += id;
    }
}

console.log(sum);
