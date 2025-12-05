import { Range, RangeSet } from "@/Range.ts";

const [rs, is] = Deno.readTextFileSync("input").trim().split("\n\n");
const ranges = new RangeSet(rs.split("\n").map((l) => new Range(...l.split("-").map(Number) as [number, number])));
const ids = is.split("\n").map(Number);

console.log(ids.filter((id) => ranges.has(id)).length);
