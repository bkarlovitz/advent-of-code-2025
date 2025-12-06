const fs = require('fs');

const lines = fs.readFileSync('../input.txt', 'utf-8').trim().split('\n');
const grid = lines.map(line => line.split(''));

const rows = grid.length;
const cols = grid[0].length;

// 8 directions: up, down, left, right, and 4 diagonals
const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

let accessibleCount = 0;

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        // Only check rolls of paper
        if (grid[r][c] !== '@') continue;

        // Count adjacent rolls
        let adjacentRolls = 0;
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '@') {
                adjacentRolls++;
            }
        }

        // Accessible if fewer than 4 adjacent rolls
        if (adjacentRolls < 4) {
            accessibleCount++;
        }
    }
}

console.log(accessibleCount);
