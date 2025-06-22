let tileSize = 100;
let tileHeight = 40; // for 3D depth
let grid = [];
let cols = 10;
let rows = 10;

let tileTypes = ["grass", "dry", "path", "water"];
let hoveredTile = null;

function setup() {
    var canvas = createCanvas(1000, 800);
    canvas.parent('garden-container');

    angleMode(DEGREES);
    loop();

    // Initialize grid with random tile types
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = random(tileTypes.slice(0, 1)); // only grass
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
        drawWaterfall(x, y)
    }

    pop();
}

function getColorForType(type) {
    switch (type) {
        case "grass": return color(0, 154, 23);
        case "dry": return color(0, 128, 19);
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
