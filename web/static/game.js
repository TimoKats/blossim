let tileSize = 120;
let tileHeight = 40; // for 3D depth
let grid = [];
let cols = 8;
let rows = 8;

let tileTypes = ["grass", "dry", "path", "water"];
let hoveredTile = null;

function setup() {
    var canvas = createCanvas(1000, 700);
    canvas.parent('garden-container');

    angleMode(DEGREES);
    loop();

    // Initialize grid with random tile types
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = random(tileTypes.slice(0, 2)); // only grass
        }
    }
}

function draw() {
    // background(220);
    translate(width / 2, 150);

    hoveredTile = getHoveredTile();

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let pos = isoToScreen(x, y);
            draw3DTile(pos.x, pos.y, grid[x][y], hoveredTile?.x === x && hoveredTile?.y === y);
        }
    }
}

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

function getHoveredTile() {
    let { x, y } = screenToIso(mouseX, mouseY);
    if (x >= 0 && y >= 0 && x < cols && y < rows) {
        return { x, y };
    }
    return null;
}

function draw3DTile(x, y, type, isHovered) {
    push();
    translate(x, y);

    // Colors
    let topColor = getColorForType(type);
    let sideColorL = lerpColor(color(80), topColor, 0.5);
    let sideColorR = lerpColor(color(60), topColor, 0.5);
    if (type == "water") {
        sideColorL = getColorForType(type);
        sideColorR = getColorForType(type);
    }

    // Draw right side
    fill(sideColorR);
    noStroke();
    beginShape();
    vertex(0, tileSize / 2);
    vertex(tileSize / 2, tileSize / 4);
    vertex(tileSize / 2, tileSize / 4 + tileHeight);
    vertex(0, tileSize / 2 + tileHeight);
    endShape(CLOSE);

    // Draw left side
    fill(sideColorL);
    noStroke();
    beginShape();
    vertex(0, tileSize / 2);
    vertex(-tileSize / 2, tileSize / 4);
    vertex(-tileSize / 2, tileSize / 4 + tileHeight);
    vertex(0, tileSize / 2 + tileHeight);
    endShape(CLOSE);

    // Draw top surface
    noStroke();
    fill(isHovered ? color(255, 255, 150) : topColor);
    beginShape();
    vertex(0, 0);
    vertex(tileSize / 2, tileSize / 4);
    vertex(0, tileSize / 2);
    vertex(-tileSize / 2, tileSize / 4);
    endShape(CLOSE);

    if (type === "water") {
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

    pop();
}

function getColorForType(type) {
    switch (type) {
        case "grass": return color(94, 200, 9);
        case "dry": return color(94, 181, 9);
        case "path": return color(183, 194, 178);
        case "water": return color(31, 182, 237);
        default: return color(200);
    }
}

// Interactivity: click to cycle tile type
function mousePressed() {
    if (hoveredTile) {
        let { x, y } = hoveredTile;
        grid[x][y] = tileTypes[3];
        redraw();
    }
}

// Hover tracking
function mouseMoved() {
    redraw(); // Only redraw when mouse moves to reduce unnecessary draws
}
