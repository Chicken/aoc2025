const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split("").map(Number));

let sum = 0;

for (const bank of input) {
    let lastIdx = 0;
    for (let i = 0; i < 12; i++) {
        const largest = Math.max(...bank.slice(lastIdx, i - 11 || undefined));
        lastIdx = bank.slice(lastIdx).indexOf(largest) + lastIdx + 1;
        sum += largest * 10 ** (11 - i);
    }
}

console.log(sum);
