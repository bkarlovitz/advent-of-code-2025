const fs = require('fs');

const lines = fs.readFileSync('../input.txt', 'utf-8').trim().split('\n');

let total = 0n;

for (const line of lines) {
    const n = line.length;
    const k = 12; // need to pick 12 digits

    let result = '';
    let startPos = 0;

    for (let i = 0; i < k; i++) {
        // For the i-th digit (0-indexed), we can pick from startPos to n - (k - i)
        // because we need (k - i - 1) more digits after this one
        const endPos = n - (k - i);

        let maxDigit = '0';
        let maxPos = startPos;

        for (let j = startPos; j <= endPos; j++) {
            if (line[j] > maxDigit) {
                maxDigit = line[j];
                maxPos = j;
            }
        }

        result += maxDigit;
        startPos = maxPos + 1;
    }

    total += BigInt(result);
}

console.log(total.toString());
