const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

// Parse red tile coordinates (polygon vertices in order)
const vertices = lines.map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
});

const n = vertices.length;

// Build polygon edges (connecting consecutive vertices, wrapping around)
const edges = [];
for (let i = 0; i < n; i++) {
    edges.push({
        x1: vertices[i].x,
        y1: vertices[i].y,
        x2: vertices[(i + 1) % n].x,
        y2: vertices[(i + 1) % n].y
    });
}

// Check if point is on a segment
function pointOnSegment(px, py, e) {
    if (e.x1 === e.x2) { // Vertical segment
        if (px === e.x1) {
            return py >= Math.min(e.y1, e.y2) && py <= Math.max(e.y1, e.y2);
        }
    } else { // Horizontal segment
        if (py === e.y1) {
            return px >= Math.min(e.x1, e.x2) && px <= Math.max(e.x1, e.x2);
        }
    }
    return false;
}

// Check if point is inside polygon or on boundary (ray casting)
function pointInPolygon(px, py) {
    // Check boundary first
    for (const e of edges) {
        if (pointOnSegment(px, py, e)) return true;
    }

    // Ray casting - count crossings with vertical edges to the right
    let crossings = 0;
    for (const e of edges) {
        if (e.x1 === e.x2) { // Vertical edge
            const x = e.x1;
            if (x > px) {
                const minY = Math.min(e.y1, e.y2);
                const maxY = Math.max(e.y1, e.y2);
                if (py > minY && py < maxY) {
                    crossings++;
                }
            }
        }
    }
    return crossings % 2 === 1;
}

// Check if a polygon edge passes through the rectangle's strict interior
function edgePassesThroughInterior(e, minX, maxX, minY, maxY) {
    if (e.y1 === e.y2) { // Horizontal edge
        const y = e.y1;
        if (y > minY && y < maxY) {
            const eMinX = Math.min(e.x1, e.x2);
            const eMaxX = Math.max(e.x1, e.x2);
            if (eMaxX > minX && eMinX < maxX) return true;
        }
    } else { // Vertical edge
        const x = e.x1;
        if (x > minX && x < maxX) {
            const eMinY = Math.min(e.y1, e.y2);
            const eMaxY = Math.max(e.y1, e.y2);
            if (eMaxY > minY && eMinY < maxY) return true;
        }
    }
    return false;
}

// Check if rectangle with opposite corners at vertices i and j is fully contained
function isRectContained(i, j) {
    const v1 = vertices[i];
    const v2 = vertices[j];
    const minX = Math.min(v1.x, v2.x);
    const maxX = Math.max(v1.x, v2.x);
    const minY = Math.min(v1.y, v2.y);
    const maxY = Math.max(v1.y, v2.y);

    // Check the two "other" corners are inside polygon
    if (!pointInPolygon(minX, maxY)) return false;
    if (!pointInPolygon(maxX, minY)) return false;

    // Check no polygon edge passes through rectangle interior
    for (const e of edges) {
        if (edgePassesThroughInterior(e, minX, maxX, minY, maxY)) return false;
    }

    return true;
}

// Find largest valid rectangle
let maxArea = 0;

for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
        if (isRectContained(i, j)) {
            const v1 = vertices[i];
            const v2 = vertices[j];
            const area = (Math.abs(v2.x - v1.x) + 1) * (Math.abs(v2.y - v1.y) + 1);
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }
}

console.log(maxArea);
