const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const sections = input.trim().split('\n\n');

// Parse shapes and count cells in each
const shapeCells = [];
for (let i = 0; i < 6; i++) {
    const lines = sections[i].split('\n');
    let cells = 0;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (lines[r + 1][c] === '#') cells++;
        }
    }
    shapeCells.push(cells);
}

// Parse regions and check if pieces can fit
const regionLines = sections[6].split('\n');
let count = 0;

for (const line of regionLines) {
    const match = line.match(/(\d+)x(\d+): (.+)/);
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);
    const counts = match[3].split(' ').map(Number);

    // Calculate total cells needed
    let totalCells = 0;
    for (let i = 0; i < 6; i++) {
        totalCells += counts[i] * shapeCells[i];
    }

    // Check if pieces can fit: total cells must fit in area, and dimensions >= 3
    if (totalCells <= width * height && width >= 3 && height >= 3) {
        count++;
    }
}

console.log(count);
