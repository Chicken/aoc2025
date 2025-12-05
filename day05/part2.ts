import { Range, RangeSet } from "@/Range.ts";

const [rs] = Deno.readTextFileSync("input").trim().split("\n\n");
const ranges = new RangeSet(rs.split("\n").map((l) => new Range(...l.split("-").map(Number) as [number, number])));

console.log(ranges.size);
