const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Parse junction box positions
const boxes = lines.map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return { x, y, z };
});

// Calculate squared distance between two boxes (no need for sqrt since we only compare)
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
        parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
}

function union(x, y) {
    const px = find(x);
    const py = find(y);
    if (px === py) return; // Already in same circuit

    // Union by rank
    if (rank[px] < rank[py]) {
        parent[px] = py;
    } else if (rank[px] > rank[py]) {
        parent[py] = px;
    } else {
        parent[py] = px;
        rank[px]++;
    }
}

// Connect the 1000 closest pairs
for (let i = 0; i < 1000; i++) {
    union(pairs[i].i, pairs[i].j);
}

// Count circuit sizes
const circuitSizes = new Map();
for (let i = 0; i < boxes.length; i++) {
    const root = find(i);
    circuitSizes.set(root, (circuitSizes.get(root) || 0) + 1);
}

// Get the three largest circuits
const sizes = Array.from(circuitSizes.values()).sort((a, b) => b - a);
const result = sizes[0] * sizes[1] * sizes[2];

console.log(result);
