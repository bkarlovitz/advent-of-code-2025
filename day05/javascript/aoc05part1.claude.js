const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8').trim();
const [rangesSection, idsSection] = input.split('\n\n');

// Parse ranges
const ranges = rangesSection.split('\n').map(line => {
    const [start, end] = line.split('-').map(BigInt);
    return { start, end };
});

// Parse ingredient IDs
const ingredientIds = idsSection.split('\n').map(BigInt);

// Count fresh ingredients
let freshCount = 0;

for (const id of ingredientIds) {
    // Check if this ID falls within any range
    for (const { start, end } of ranges) {
        if (id >= start && id <= end) {
            freshCount++;
            break; // Found in a range, no need to check more
        }
    }
}

console.log(freshCount);
