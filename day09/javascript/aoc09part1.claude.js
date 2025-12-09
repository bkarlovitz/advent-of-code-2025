const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Parse red tile coordinates
const tiles = lines.map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
});

// Find the largest rectangle using two red tiles as opposite corners
// Area = (|x2 - x1| + 1) * (|y2 - y1| + 1)
let maxArea = 0;

for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
        const width = Math.abs(tiles[j].x - tiles[i].x) + 1;
        const height = Math.abs(tiles[j].y - tiles[i].y) + 1;
        const area = width * height;
        if (area > maxArea) {
            maxArea = area;
        }
    }
}

console.log(maxArea);
