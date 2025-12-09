const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split(",").map(Number));

let largest = 0;

for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
        const a = input[i];
        const b = input[j];
        const area = (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1);
        if (area > largest) largest = area;
    }
}

console.log(largest);
