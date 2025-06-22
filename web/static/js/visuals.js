
function getHoveredTile() {
    let { x, y } = screenToIso(mouseX, mouseY);
    if (x >= 0 && y >= 0 && x < cols && y < rows) {
        return { x, y };
    }
    return null;
}

function drawWaterfall(x, y) {
    const iso = screenToIso(x + width / 2, y + 150);
    const i = iso.x, j = iso.y;

    const belowMissing = j + 1 >= rows || !grid[i]?.[j + 1];
    const rightMissing = i + 1 >= cols || !grid[i + 1]?.[j];

    let waterfallDepth = height - (y + tileSize / 2 + tileHeight);

    noStroke();
    fill(31, 182, 237); // translucent blue

    // Falling front face (downward)
    if (belowMissing) {
        beginShape();
        vertex(0, tileSize / 2 + tileHeight);                             // top center
        vertex(-tileSize / 2, tileSize / 4 + tileHeight);                // top left
        vertex(-tileSize / 2, tileSize / 4 + tileHeight + waterfallDepth);
        vertex(0, tileSize / 2 + tileHeight + waterfallDepth);
        endShape(CLOSE);
    }

    // Falling right face
    if (rightMissing) {
        beginShape();
        vertex(0, tileSize / 2 + tileHeight);                              // top center
        vertex(tileSize / 2, tileSize / 4 + tileHeight);                  // top right
        vertex(tileSize / 2, tileSize / 4 + tileHeight + waterfallDepth);
        vertex(0, tileSize / 2 + tileHeight + waterfallDepth);
        endShape(CLOSE);
    }

    // --- Animated water stream effect ---

    stroke(52, 228, 247);
    strokeWeight(2);

    let streamsCount = 4;
    let speed = 1;
    let streamLength = 20;

    if (belowMissing) {
        for (let s = 0; s < streamsCount; s++) {
            let xPos = map(s, 0, streamsCount - 1, -tileSize / 2 + 4, -4);
            let yPos = (frameCount * speed + s * 120) % (waterfallDepth + streamLength) - streamLength;
            line(xPos, tileSize / 4 + tileHeight + yPos, xPos, tileSize / 4 + tileHeight + yPos + streamLength);
        }
    }

    if (rightMissing) {
        for (let s = 0; s < streamsCount; s++) {
            let xPos = map(s, 0, streamsCount - 1, 4, tileSize / 2 - 4);
            let yPos = (frameCount * speed + s * 40) % (waterfallDepth + streamLength) - streamLength;
            line(xPos, tileSize / 4 + tileHeight + yPos, xPos, tileSize / 4 + tileHeight + yPos + streamLength);
        }
    }
}