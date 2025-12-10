const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

function parseMachine(line) {
    // Parse indicator light diagram [...]
    const targetMatch = line.match(/\[([.#]+)\]/);
    const targetStr = targetMatch[1];
    const numLights = targetStr.length;

    // Convert target to bitmask (bit i = 1 if light i should be on)
    let target = 0;
    for (let i = 0; i < numLights; i++) {
        if (targetStr[i] === '#') {
            target |= (1 << i);
        }
    }

    // Parse button wiring schematics (...)
    const buttonMatches = [...line.matchAll(/\(([^)]+)\)/g)];
    const buttons = [];
    for (const match of buttonMatches) {
        const indices = match[1].split(',').map(Number);
        let buttonMask = 0;
        for (const idx of indices) {
            buttonMask |= (1 << idx);
        }
        buttons.push(buttonMask);
    }

    return { target, buttons };
}

function minPresses(target, buttons) {
    const numButtons = buttons.length;
    let minCount = Infinity;

    // Try all subsets of buttons (each button pressed 0 or 1 times)
    for (let mask = 0; mask < (1 << numButtons); mask++) {
        let state = 0;
        let count = 0;
        for (let i = 0; i < numButtons; i++) {
            if (mask & (1 << i)) {
                state ^= buttons[i];
                count++;
            }
        }
        if (state === target) {
            minCount = Math.min(minCount, count);
        }
    }

    return minCount === Infinity ? -1 : minCount;
}

let totalPresses = 0;
for (const line of lines) {
    const { target, buttons } = parseMachine(line);
    const presses = minPresses(target, buttons);
    totalPresses += presses;
}

console.log(totalPresses);
