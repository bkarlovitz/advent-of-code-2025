const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Build adjacency list (device -> list of output devices)
const graph = new Map();

for (const line of lines) {
    const [device, outputs] = line.split(': ');
    graph.set(device, outputs.split(' '));
}

// Count paths from current node to "out" that visit both dac and fft
// State: (node, visitedDac, visitedFft)
const memo = new Map();

function countPaths(node, visitedDac, visitedFft) {
    // Update visited flags based on current node
    if (node === 'dac') visitedDac = true;
    if (node === 'fft') visitedFft = true;

    // Reached the end - only count if we visited both dac and fft
    if (node === 'out') {
        return (visitedDac && visitedFft) ? 1n : 0n;
    }

    // Memoization key includes the state
    const key = `${node},${visitedDac},${visitedFft}`;
    if (memo.has(key)) return memo.get(key);

    const outputs = graph.get(node);
    if (!outputs) return 0n;

    let total = 0n;
    for (const next of outputs) {
        total += countPaths(next, visitedDac, visitedFft);
    }

    memo.set(key, total);
    return total;
}

const result = countPaths('svr', false, false);
console.log(result.toString());
