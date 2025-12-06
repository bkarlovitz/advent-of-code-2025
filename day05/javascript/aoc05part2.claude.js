const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8').trim();
const [rangesSection] = input.split('\n\n');

// Parse ranges
const ranges = rangesSection.split('\n').map(line => {
    const [start, end] = line.split('-').map(BigInt);
    return { start, end };
});

// Sort ranges by start
ranges.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
});

// Merge overlapping ranges
const merged = [];
for (const range of ranges) {
    if (merged.length === 0) {
        merged.push({ start: range.start, end: range.end });
    } else {
        const last = merged[merged.length - 1];
        // Check if ranges overlap or are adjacent
        if (range.start <= last.end + 1n) {
            // Merge: extend the end if needed
            if (range.end > last.end) {
                last.end = range.end;
            }
        } else {
            // No overlap, add new range
            merged.push({ start: range.start, end: range.end });
        }
    }
}

// Count total fresh IDs
let total = 0n;
for (const { start, end } of merged) {
    total += end - start + 1n;
}

console.log(total.toString());
