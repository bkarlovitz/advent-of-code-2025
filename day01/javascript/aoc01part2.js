const fs = require('fs');

const inputLines = fs.readFileSync('../input.txt', 'utf-8').split('\n');

let currentPosition = 50;
let leftAtZero = 0;

for (let i = 0; i < inputLines.length; i++) {
    let move = inputLines[i];
    let direction = move.charAt(0);
    let rotationSize = parseInt(move.slice(1), 10);

    let newPosition;
    if (direction === "R") {
        newPosition = (((currentPosition + rotationSize) % 100) + 100) % 100;
    } else {
        newPosition = (((currentPosition - rotationSize) % 100) + 100) % 100;
    }

    if (newPosition === 0) {
        leftAtZero++;
    }

    currentPosition = newPosition;
}

console.log(leftAtZero);