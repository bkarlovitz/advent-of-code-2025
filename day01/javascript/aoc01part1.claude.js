const fs = require('fs');

const inputLines = fs.readFileSync('../input.txt', 'utf-8').trim().split('\n');

let currentPosition = 50;
let timesAtZero = 0;

for (const line of inputLines) {
    const direction = line.charAt(0);
    const distance = parseInt(line.slice(1), 10);

    if (direction === 'R') {
        currentPosition = (currentPosition + distance) % 100;
    } else {
        currentPosition = ((currentPosition - distance) % 100 + 100) % 100;
    }

    if (currentPosition === 0) {
        timesAtZero++;
    }
}

console.log(timesAtZero);
