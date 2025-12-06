const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

const numRows = lines.length - 1; // Last row is operations
const numberRows = lines.slice(0, numRows);
const operatorRow = lines[numRows];

// Find the maximum line length
const maxLen = Math.max(...lines.map(l => l.length));

// Pad all lines to same length
const paddedLines = lines.map(l => l.padEnd(maxLen));
const paddedNumberRows = numberRows.map(l => l.padEnd(maxLen));
const paddedOperatorRow = operatorRow.padEnd(maxLen);

// Find separator columns (all spaces in all rows)
const isSeparator = [];
for (let col = 0; col < maxLen; col++) {
    let allSpaces = true;
    for (const line of paddedLines) {
        if (line[col] !== ' ') {
            allSpaces = false;
            break;
        }
    }
    isSeparator.push(allSpaces);
}

// Group columns into problems
const problems = [];
let currentStart = null;

for (let col = 0; col <= maxLen; col++) {
    if (col < maxLen && !isSeparator[col]) {
        if (currentStart === null) {
            currentStart = col;
        }
    } else {
        if (currentStart !== null) {
            // Extract problem from columns currentStart to col-1
            const operation = paddedOperatorRow.substring(currentStart, col).trim();

            // For part 2: read each column as a number (top to bottom = most to least significant)
            // Then read columns right-to-left
            const numbers = [];

            // Iterate columns right-to-left within this problem
            for (let c = col - 1; c >= currentStart; c--) {
                // Build number from this column (top to bottom)
                let numStr = '';
                for (const row of paddedNumberRows) {
                    const digit = row[c];
                    if (digit !== ' ') {
                        numStr += digit;
                    }
                }
                if (numStr) {
                    numbers.push(BigInt(numStr));
                }
            }

            problems.push({ numbers, operation });
            currentStart = null;
        }
    }
}

// Compute results
let grandTotal = 0n;

for (const { numbers, operation } of problems) {
    let result;
    if (operation === '+') {
        result = numbers.reduce((a, b) => a + b, 0n);
    } else if (operation === '*') {
        result = numbers.reduce((a, b) => a * b, 1n);
    }
    grandTotal += result;
}

console.log(grandTotal.toString());
