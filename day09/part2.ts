const input = Deno.readTextFileSync("input").trim().split("\n").map((l) => l.trim().split(",").map(Number));
const { min, max, abs } = Math;

// these are probably not generally correct but work just because

function pointInPolygon(c: number[]) {
    const [cx, cy] = c;
    let inside = false;

    for (let i = 0, j = input.length - 1; i < input.length; j = i++) {
        const [x1, y1] = input[i], [x2, y2] = input[j];

        if (x1 === x2 && cx === x1 && cy >= min(y1, y2) && cy <= max(y1, y2)) return true;
        else if (y1 === y2 && cy === y1 && cy >= min(x1, x2) && cy <= max(x1, x2)) return true;

        if (cy >= min(y1, y2) && cy < max(y1, y2) && cx > x1) inside = !inside;
    }

    return inside;
}

function edgesIntersect(p1: number[], p2: number[], p3: number[], p4: number[]) {
    const [x1, y1] = p1, [x2, y2] = p2, [x3, y3] = p3, [x4, y4] = p4;
    if ((x1 === x2) === (x3 === x4)) return false;
    if (x1 === x2) return y3 > min(y1, y2) && y3 < max(y1, y2) && min(x3, x4) < x1 && max(x3, x4) > x1;
    else return x3 > min(x1, x2) && x3 < max(x1, x2) && min(y3, y4) < y1 && max(y3, y4) > y1;
}

let largest = 0;

for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
        const [ax, ay] = input[i], [bx, by] = input[j];
        const area = (abs(ax - bx) + 1) * (abs(ay - by) + 1);
        if (area < largest) continue;

        const tl = [min(ax, bx), min(ay, by)];
        const br = [max(ax, bx), max(ay, by)];
        const tr = [br[0], tl[1]];
        const bl = [tl[0], br[1]];
        const corners = [tl, tr, br, bl];
        if (!corners.every(pointInPolygon)) continue;

        let intersects = false;
        corners:
        for (let k = 0; k < corners.length; k++) {
            const p1 = corners[k];
            const p2 = corners[(k + 1) % corners.length];
            for (let l = 0; l < input.length; l++) {
                const p3 = input[l];
                const p4 = input[(l + 1) % input.length];
                if (edgesIntersect(p1, p2, p3, p4)) {
                    intersects = true;
                    break corners;
                }
            }
        }
        if (!intersects) largest = area;
    }
}

console.log(largest);
