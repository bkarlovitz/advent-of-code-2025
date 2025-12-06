const fs = require('fs');

const lines = fs.readFileSync('../input.txt', 'utf-8').trim().split('\n');

let totalJoltage = 0;

for (const line of lines) {
    let maxJoltage = 0;

    // Try each position as the first battery
    for (let i = 0; i < line.length - 1; i++) {
        const firstDigit = parseInt(line[i], 10);

        // Find the max digit after position i
        let maxSecond = 0;
        for (let j = i + 1; j < line.length; j++) {
            const d = parseInt(line[j], 10);
            if (d > maxSecond) maxSecond = d;
        }

        const joltage = firstDigit * 10 + maxSecond;
        if (joltage > maxJoltage) maxJoltage = joltage;
    }

    totalJoltage += maxJoltage;
}

console.log(totalJoltage);
