const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split(",").map(Number));
const edges: number[][] = [];

for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
        const a = input[i]!;
        const b = input[j]!;
        edges.push([i, j, Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)]);
    }
}

edges.sort((a, b) => b[2] - a[2]);
const circuits: number[][] = [];

while (edges.length > 0) {
    const [a, b] = edges.pop()!;
    const aCircuit = circuits.find((c) => c.includes(a));
    const bCircuit = circuits.find((c) => c.includes(b));
    if (aCircuit && aCircuit === bCircuit) continue;
    if (aCircuit && bCircuit) {
        circuits.splice(circuits.indexOf(bCircuit), 1);
        aCircuit.push(...bCircuit);
    } else if (aCircuit) aCircuit.push(b);
    else if (bCircuit) bCircuit.push(a);
    else circuits.push([a, b]);
    if (circuits.length === 1 && circuits[0].length === input.length) {
        console.log(input[a][0] * input[b][0]);
        break;
    }
}
