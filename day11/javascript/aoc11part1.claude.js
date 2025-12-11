const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Build adjacency list (device -> list of output devices)
const graph = new Map();

for (const line of lines) {
    const [device, outputs] = line.split(': ');
    graph.set(device, outputs.split(' '));
}

// Count all paths from current node to "out" using memoization
const memo = new Map();

function countPaths(node) {
    if (node === 'out') return 1n;

    if (memo.has(node)) return memo.get(node);

    const outputs = graph.get(node);
    if (!outputs) return 0n; // No outputs from this node

    let total = 0n;
    for (const next of outputs) {
        total += countPaths(next);
    }

    memo.set(node, total);
    return total;
}

const result = countPaths('you');
console.log(result.toString());
