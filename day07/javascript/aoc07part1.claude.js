const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Find S position
let startRow = 0;
let startCol = 0;
for (let r = 0; r < lines.length; r++) {
    const col = lines[r].indexOf('S');
    if (col !== -1) {
        startRow = r;
        startCol = col;
        break;
    }
}

const width = lines[0].length;

// Track beam positions (set of columns with active beams)
let beams = new Set([startCol]);
let splits = 0;

// Process each row below the starting position
for (let r = startRow + 1; r < lines.length; r++) {
    const newBeams = new Set();

    for (const col of beams) {
        // Skip beams that have exited the grid
        if (col < 0 || col >= width) continue;

        if (lines[r][col] === '^') {
            // Beam hits splitter - count the split and emit two new beams
            splits++;
            newBeams.add(col - 1);
            newBeams.add(col + 1);
        } else {
            // Beam continues downward
            newBeams.add(col);
        }
    }

    beams = newBeams;
}

console.log(splits);
