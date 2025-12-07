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

// Track particle counts at each column (Map: column -> count)
let particles = new Map([[startCol, 1n]]);

// Process each row below the starting position
for (let r = startRow + 1; r < lines.length; r++) {
    const newParticles = new Map();

    for (const [col, count] of particles) {
        // Skip particles that have exited the grid
        if (col < 0 || col >= width) continue;

        if (lines[r][col] === '^') {
            // Particle hits splitter - split into left and right
            newParticles.set(col - 1, (newParticles.get(col - 1) || 0n) + count);
            newParticles.set(col + 1, (newParticles.get(col + 1) || 0n) + count);
        } else {
            // Particle continues downward
            newParticles.set(col, (newParticles.get(col) || 0n) + count);
        }
    }

    particles = newParticles;
}

// Sum all particles (each represents a timeline)
let totalTimelines = 0n;
for (const [col, count] of particles) {
    if (col >= 0 && col < width) {
        totalTimelines += count;
    }
}

console.log(totalTimelines.toString());
