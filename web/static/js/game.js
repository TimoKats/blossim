function setup() {
    var canvas = createCanvas(1000, 700);
    canvas.parent('garden-container');

    angleMode(DEGREES);
    loop();

    // Initialize grid with random tile types
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = weightedRandom(tileTypes, tileWeights);
        }
    }
}

function draw() {
    translate(width / 2, 50);
    hoveredTile = getHoveredTile();

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let pos = isoToScreen(x, y);
            draw3DTile(pos.x, pos.y, grid[x][y], hoveredTile?.x === x && hoveredTile?.y === y);
        }
    }
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
    fill(isHovered ? color(255, 255, 100) : topColor);
    beginShape();
    vertex(0, 0);
    vertex(tileSize / 2, tileSize / 4);
    vertex(0, tileSize / 2);
    vertex(-tileSize / 2, tileSize / 4);
    endShape(CLOSE);

    if (type === "water") {
        drawWaterfall(x, y);
    }
    if (type === "grass") {
        randomSeed(x + y)
        drawGrass();
        if (random() > 0.9) {
            drawTree();
        }
    }

    pop();
}

function getColorForType(type) {
    switch (type) {
        case "grass": return color(119, 179, 0);
        case "dry": return color(215, 191, 83);
        case "path": return color(183, 194, 178);
        case "water": return color(31, 182, 237);
        default: return color(200);
    }
}

// Interactivity: click to cycle tile type
function mousePressed() {
    if (hoveredTile) {
        let { x, y } = hoveredTile;
        let typeIndex = getTileFromAction()
        if (typeIndex >= 0) {
            grid[x][y] = tileTypes[typeIndex];
        }
        background(182, 211, 182);
        redraw();
    }
}

// Hover tracking (to prevent unnessary draws)
function mouseMoved() {
    redraw();
}
