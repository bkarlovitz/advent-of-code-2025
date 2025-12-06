const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8').trim();

const ranges = input.split(',').map(range => {
    const [start, end] = range.split('-').map(BigInt);
    return { start, end };
});

// Track which doubled numbers we've already counted (to avoid duplicates if ranges overlap)
const counted = new Set();
let sum = 0n;

// For each range, find doubled numbers within it
for (const { start, end } of ranges) {
    // Try each possible half-length (1 to 10 digits)
    for (let n = 1; n <= 10; n++) {
        const mult = 10n ** BigInt(n) + 1n;

        // Base must have exactly n digits
        const minNDigit = n === 1 ? 1n : 10n ** BigInt(n - 1);
        const maxNDigit = 10n ** BigInt(n) - 1n;

        // Find bases where b * mult is in [start, end]
        let minBase = start / mult;
        if (minBase * mult < start) minBase++;
        let maxBase = end / mult;

        // Intersect with n-digit constraint
        if (minBase < minNDigit) minBase = minNDigit;
        if (maxBase > maxNDigit) maxBase = maxNDigit;

        // Add all valid doubled numbers
        for (let b = minBase; b <= maxBase; b++) {
            const doubled = b * mult;
            const key = doubled.toString();
            if (!counted.has(key)) {
                counted.add(key);
                sum += doubled;
            }
        }
    }
}

console.log(sum.toString());
