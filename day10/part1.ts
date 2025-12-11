const rawInput = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split(" "));

const input = [];

for (const line of rawInput) {
    const lights = parseInt(
        line.shift()!.slice(1, -1).split("").map((v) => v === "#" ? "1" : "0").toReversed().join(""),
        2,
    );
    line.pop()
    const buttons = line.map((b) => b.slice(1, -1).split(",").map(Number).reduce((a, c) => a | (1 << c), 0));
    input.push({ lights, buttons });
}

let sum = 0;

for (const machine of input) {
    let min = Infinity;
    for (let i = 0; i < 2 ** machine.buttons.length; i++) {
        let val = 0;
        let used = 0;
        for (let j = 0; j < machine.buttons.length; j++) {
            if (i & (1 << j)) {
                val ^= machine.buttons[j];
                used++;
            }
        }
        if (val === machine.lights && used < min) min = used;
    }
    sum += min;
}

console.log(sum);
