const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8').trim();

const ranges = input.split(',').map(range => {
    const [start, end] = range.split('-').map(BigInt);
    return { start, end };
});

// Track which repeated-pattern numbers we've already counted
const counted = new Set();
let sum = 0n;

// Find max value to know maximum total digits
let maxVal = 0n;
for (const { end } of ranges) {
    if (end > maxVal) maxVal = end;
}
const maxDigits = maxVal.toString().length;

// For each range, find repeated-pattern numbers within it
for (const { start, end } of ranges) {
    // Try each pattern length d (1 to maxDigits/2 since we need at least 2 repetitions)
    for (let d = 1; d <= Math.floor(maxDigits / 2) + 1; d++) {
        // Try each repetition count r (at least 2)
        for (let r = 2; r * d <= maxDigits + 1; r++) {
            // Multiplier: (10^(d*r) - 1) / (10^d - 1)
            // This is the "repunit" in base 10^d with r digits
            const base = 10n ** BigInt(d);
            const totalDigits = d * r;
            const mult = (10n ** BigInt(totalDigits) - 1n) / (base - 1n);

            // Pattern must have exactly d digits (no leading zeros)
            const minPattern = d === 1 ? 1n : 10n ** BigInt(d - 1);
            const maxPattern = 10n ** BigInt(d) - 1n;

            // Find patterns where pattern * mult is in [start, end]
            let minP = start / mult;
            if (minP * mult < start) minP++;
            let maxP = end / mult;

            // Intersect with d-digit constraint
            if (minP < minPattern) minP = minPattern;
            if (maxP > maxPattern) maxP = maxPattern;

            // Add all valid repeated-pattern numbers
            for (let p = minP; p <= maxP; p++) {
                const repeated = p * mult;
                const key = repeated.toString();
                if (!counted.has(key)) {
                    counted.add(key);
                    sum += repeated;
                }
            }
        }
    }
}

console.log(sum.toString());
