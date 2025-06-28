
// Convert grid coords to screen coords (isometric)
function isoToScreen(x, y) {
    return {
        x: (x - y) * tileSize / 2,
        y: (x + y) * tileSize / 4
    };
}

// Convert mouse coords to grid coords
function screenToIso(mx, my) {
    let x = mx - width / 2;
    let y = my - 50;
    let isoX = (x / (tileSize / 2) + y / (tileSize / 4)) / 2;
    let isoY = (y / (tileSize / 4) - x / (tileSize / 2)) / 2;
    return {
        x: floor(isoX),
        y: floor(isoY)
    };
}

// used to randomly populate the garden
function weightedRandom(items, weights) {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < items.length; i++) {
        cumulativeWeight += weights[i];
        if (random < cumulativeWeight) {
            return items[i];
        }
    }
}

function getTileFromAction() {
    for (let i = 0; i < tileTypes.length; i++) {
        if (tileTypes[i] == UserAction) {
            return i;
        }
    }
    return -1
}
