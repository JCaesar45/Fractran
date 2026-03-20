function fractran(programStr) {
    // Parse fractions: "3/2, 1/3" → [[3,2], [1,3]]
    const fractions = programStr
        .split(',')
        .map(s => s.trim())
        .map(s => s.split('/').map(Number))
        .filter(([a, b]) => a > 0 && b > 0); // safety

    const result = [];
    let n = 2; // standard starting value for FRACTRAN

    // Safety limit to prevent infinite loops (though not needed for the test cases)
    const MAX_STEPS = 10000;

    for (let step = 0; step < MAX_STEPS; step++) {
        if (result.length >= 10) break;
        result.push(n);

        let updated = false;
        for (const [num, den] of fractions) {
            if (n % den === 0) {
                n = (n / den) * num;
                updated = true;
                break;
            }
        }

        if (!updated) {
            break;
        }
    }

    // If we didn't reach 10, just return what we have
    return result;
}

// Test cases
console.log(fractran("3/2, 1/3"));              // [2, 3, 1]
console.log(fractran("3/2, 5/3, 1/5"));         // [2, 3, 5, 1]
console.log(fractran("3/2, 6/3"));              // [2,3,6,9,18,27,54,81,162,243]
console.log(fractran("2/7, 7/2"));              // [2,7,2,7,2,7,2,7,2,7]
console.log(fractran("17/91, 78/85, 19/51, 23/38, 29/33, 77/29, 95/23, 77/19, 1/17, 11/13, 13/11, 15/14, 15/2, 55/1"));
// → [2, 15, 825, 725, 1925, 2275, 425, 390, 330, 290]
