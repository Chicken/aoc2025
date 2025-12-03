const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split("").map(Number));

let sum = 0;

for (const bank of input) {
    const largest = Math.max(...bank.slice(0, -1));
    const largestIdx = bank.indexOf(largest);
    const nextLargest = Math.max(...bank.slice(largestIdx + 1));
    sum += largest * 10 + nextLargest;
}

console.log(sum);
