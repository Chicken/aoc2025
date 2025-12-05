import { Range } from "@/Range.ts";

const input = Deno.readTextFileSync("input").trim().split(",")
    .map((p) => new Range(...p.split("-").map(Number) as [number, number]));

let sum = 0;

for (const range of input) {
    for (const id of range) {
        const str = id.toString();
        if (/^(.+)\1+$/.test(str)) sum += id;
    }
}

console.log(sum);
