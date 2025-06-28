
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
    let y = my - 150;
    let isoX = (x / (tileSize / 2) + y / (tileSize / 4)) / 2;
    let isoY = (y / (tileSize / 4) - x / (tileSize / 2)) / 2;
    return {
        x: floor(isoX),
        y: floor(isoY)
    };
}
