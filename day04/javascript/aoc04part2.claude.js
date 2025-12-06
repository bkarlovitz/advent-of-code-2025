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

function countAdjacentRolls(grid, r, c) {
    let count = 0;
    for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '@') {
            count++;
        }
    }
    return count;
}

let totalRemoved = 0;

while (true) {
    // Find all accessible rolls (fewer than 4 adjacent rolls)
    const toRemove = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '@' && countAdjacentRolls(grid, r, c) < 4) {
                toRemove.push([r, c]);
            }
        }
    }

    // If no rolls can be removed, we're done
    if (toRemove.length === 0) break;

    // Remove all accessible rolls
    for (const [r, c] of toRemove) {
        grid[r][c] = '.';
    }

    totalRemoved += toRemove.length;
}

console.log(totalRemoved);
