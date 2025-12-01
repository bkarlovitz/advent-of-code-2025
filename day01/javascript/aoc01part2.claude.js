const fs = require('fs');

const inputLines = fs.readFileSync('../input.txt', 'utf-8').trim().split('\n');

let pos = 50;
let count = 0;

for (const line of inputLines) {
    const dir = line.charAt(0);
    const dist = parseInt(line.slice(1), 10);

    if (dir === 'R') {
        // Moving right from pos by dist clicks
        // We hit 0 at click k when (pos + k) % 100 === 0
        // First hit at k = (100 - pos) % 100, but if pos === 0, first hit is at k = 100
        let firstHit = (100 - pos) % 100;
        if (firstHit === 0) firstHit = 100;

        if (dist >= firstHit) {
            count += Math.floor((dist - firstHit) / 100) + 1;
        }

        pos = (pos + dist) % 100;
    } else {
        // Moving left from pos by dist clicks
        // We hit 0 at click k when (pos - k) % 100 === 0
        // First hit at k = pos, but if pos === 0, first hit is at k = 100
        let firstHit = pos;
        if (firstHit === 0) firstHit = 100;

        if (dist >= firstHit) {
            count += Math.floor((dist - firstHit) / 100) + 1;
        }

        pos = ((pos - dist) % 100 + 100) % 100;
    }
}

console.log(count);
