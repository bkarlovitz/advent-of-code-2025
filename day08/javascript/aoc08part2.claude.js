const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Parse junction box positions
const boxes = lines.map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return { x, y, z };
});

// Calculate squared distance between two boxes
function distSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}

// Generate all pairs with their distances
const pairs = [];
for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
        pairs.push({ i, j, dist: distSquared(boxes[i], boxes[j]) });
    }
}

// Sort pairs by distance
pairs.sort((a, b) => a.dist - b.dist);

// Union-Find data structure
const parent = [];
const rank = [];
for (let i = 0; i < boxes.length; i++) {
    parent[i] = i;
    rank[i] = 0;
}

function find(x) {
    if (parent[x] !== x) {
        parent[x] = find(parent[x]);
    }
    return parent[x];
}

// Returns true if a merge happened (they were in different circuits)
function union(x, y) {
    const px = find(x);
    const py = find(y);
    if (px === py) return false; // Already in same circuit

    if (rank[px] < rank[py]) {
        parent[px] = py;
    } else if (rank[px] > rank[py]) {
        parent[py] = px;
    } else {
        parent[py] = px;
        rank[px]++;
    }
    return true;
}

// Connect pairs until all boxes are in one circuit
// We need (n-1) successful merges to connect n boxes into one circuit
let mergeCount = 0;
let lastPair = null;

for (const pair of pairs) {
    if (union(pair.i, pair.j)) {
        mergeCount++;
        lastPair = pair;
        if (mergeCount === boxes.length - 1) {
            break; // All connected
        }
    }
}

// Multiply X coordinates of the last two connected boxes
const result = boxes[lastPair.i].x * boxes[lastPair.j].x;
console.log(result);
