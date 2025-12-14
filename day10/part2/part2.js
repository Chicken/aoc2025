import { readFileSync } from "node:fs";
import { init } from "z3-solver";

const { Context } = await init();
const Z3 = Context("main");

const rawInput = readFileSync("../input", "utf8").trim().split("\n").map((l) => l.trim().split(" "));
const input = [];

for (const line of rawInput) {
    line.shift();
    const joltage = line.pop().slice(1, -1).split(",").map(Number);
    const buttons = line.map((b) => b.slice(1, -1).split(",").map(Number));
    input.push({ buttons, joltage });
}

let sum = 0;

for (const machine of input) {
    let min = Infinity;

    const solver = new Z3.Solver();

    const variables = machine.buttons.map((_, i) => Z3.Int.const(`var_${i}`));
    for (const v of variables) solver.add(v.ge(0));

    for (let i = 0; i < machine.joltage.length; i++) {
        const sum = [];
        for (let j = 0; j < machine.buttons.length; j++) {
            if (machine.buttons[j].includes(i)) sum.push(variables[j]);
        }
        solver.add(Z3.Sum(...sum).eq(machine.joltage[i]));
    }

    while (await solver.check() === "sat") {
        const model = solver.model();
        const values = variables.map((v) => parseInt(model.get(v).toString(), 10));

        const total = values.reduce((a, c) => a + c, 0);
        solver.add(Z3.Sum(...variables).lt(total));
        min = total;
    }

    sum += min;
}

console.log(sum);
