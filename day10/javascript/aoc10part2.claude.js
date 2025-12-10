const fs = require('fs');

const input = fs.readFileSync('../input.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);

function parseMachine(line) {
    // Parse button wiring schematics (...)
    const buttonMatches = [...line.matchAll(/\(([^)]+)\)/g)];
    const buttons = [];
    for (const match of buttonMatches) {
        const indices = match[1].split(',').map(Number);
        buttons.push(indices);
    }

    // Parse joltage requirements {...}
    const joltageMatch = line.match(/\{([^}]+)\}/);
    const target = joltageMatch[1].split(',').map(Number);

    return { buttons, target };
}

// Solve the system Ax = b for minimum sum(x), x >= 0 integers
// A[i][j] = 1 if button j affects counter i
function solveMinPresses(buttons, target) {
    const n = target.length; // counters
    const k = buttons.length; // buttons

    // Build coefficient matrix
    const A = [];
    for (let i = 0; i < n; i++) {
        A.push([]);
        for (let j = 0; j < k; j++) {
            A[i].push(buttons[j].includes(i) ? 1 : 0);
        }
    }

    // Use Gaussian elimination with rational arithmetic
    // Augment matrix with target
    const aug = A.map((row, i) => [...row, target[i]]);

    // Gaussian elimination to row echelon form
    const pivotCols = [];
    let pivotRow = 0;

    for (let col = 0; col < k && pivotRow < n; col++) {
        // Find pivot
        let maxRow = pivotRow;
        for (let row = pivotRow + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
                maxRow = row;
            }
        }

        if (aug[maxRow][col] === 0) continue; // No pivot in this column

        // Swap rows
        [aug[pivotRow], aug[maxRow]] = [aug[maxRow], aug[pivotRow]];

        pivotCols.push(col);

        // Eliminate below
        for (let row = pivotRow + 1; row < n; row++) {
            if (aug[row][col] !== 0) {
                const factor = aug[row][col] / aug[pivotRow][col];
                for (let c = col; c <= k; c++) {
                    aug[row][c] -= factor * aug[pivotRow][c];
                }
            }
        }
        pivotRow++;
    }

    // Check for inconsistency
    for (let row = pivotRow; row < n; row++) {
        if (Math.abs(aug[row][k]) > 1e-9) {
            return Infinity; // No solution
        }
    }

    // Back substitution to express pivot variables in terms of free variables
    const numPivots = pivotCols.length;
    const freeVars = [];
    for (let j = 0; j < k; j++) {
        if (!pivotCols.includes(j)) {
            freeVars.push(j);
        }
    }

    // If no free variables, solution is unique
    if (freeVars.length === 0) {
        // Back substitution
        const x = new Array(k).fill(0);
        for (let i = numPivots - 1; i >= 0; i--) {
            const col = pivotCols[i];
            let val = aug[i][k];
            for (let j = col + 1; j < k; j++) {
                val -= aug[i][j] * x[j];
            }
            x[col] = val / aug[i][col];
        }

        // Check non-negative integer
        for (let j = 0; j < k; j++) {
            if (x[j] < -1e-9 || Math.abs(x[j] - Math.round(x[j])) > 1e-9) {
                return Infinity;
            }
            x[j] = Math.round(x[j]);
        }

        return x.reduce((a, b) => a + b, 0);
    }

    // With free variables, search for minimum
    // Express: x_pivot = b' - sum(coef[i][f] * x_free[f])
    // Back substitute to get coefficients

    // Reduced row echelon form
    for (let i = numPivots - 1; i >= 0; i--) {
        const col = pivotCols[i];
        const divisor = aug[i][col];
        for (let c = 0; c <= k; c++) {
            aug[i][c] /= divisor;
        }
        for (let row = 0; row < i; row++) {
            const factor = aug[row][col];
            for (let c = 0; c <= k; c++) {
                aug[row][c] -= factor * aug[i][c];
            }
        }
    }

    // Now aug is in RREF
    // x_pivot[i] = aug[i][k] - sum over free vars j of (aug[i][j] * x_free[j])

    // Search over free variable values
    // Bound free variables by reasonable range
    const maxVal = Math.max(...target) + 10;

    function search(freeIdx, freeVals) {
        if (freeIdx === freeVars.length) {
            // Compute pivot variable values
            const x = new Array(k).fill(0);
            for (let f = 0; f < freeVars.length; f++) {
                x[freeVars[f]] = freeVals[f];
            }
            for (let i = 0; i < numPivots; i++) {
                const col = pivotCols[i];
                let val = aug[i][k];
                for (let f = 0; f < freeVars.length; f++) {
                    val -= aug[i][freeVars[f]] * freeVals[f];
                }
                x[col] = val;
            }

            // Check non-negative integer
            for (let j = 0; j < k; j++) {
                if (x[j] < -1e-9 || Math.abs(x[j] - Math.round(x[j])) > 1e-9) {
                    return Infinity;
                }
            }

            return x.reduce((a, b) => a + Math.round(b), 0);
        }

        let minSum = Infinity;
        for (let v = 0; v <= maxVal; v++) {
            freeVals[freeIdx] = v;
            minSum = Math.min(minSum, search(freeIdx + 1, freeVals));
        }
        return minSum;
    }

    return search(0, []);
}

let totalPresses = 0;
for (const line of lines) {
    const { buttons, target } = parseMachine(line);
    const presses = solveMinPresses(buttons, target);
    totalPresses += presses;
}

console.log(totalPresses);
