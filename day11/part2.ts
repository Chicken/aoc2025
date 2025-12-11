import { memoize } from "@/function.ts";

const input = Object.fromEntries(
    Deno.readTextFileSync("input").trim().split("\n").map((l) =>
        [l.split(": ")[0], l.split(": ")[1].split(" ")] as [string, string[]]
    ),
);

const follow = memoize((m: string, dac: boolean = false, fft: boolean = false): number => {
    if (m === "out") return dac && fft ? 1 : 0;
    let sum = 0;
    for (const m2 of input[m]) sum += follow(m2, dac || m === "dac", fft || m === "fft");
    return sum;
});

console.log(follow("svr"));
