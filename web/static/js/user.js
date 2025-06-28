var UserAction = "";

// grid
let tileSize = 100;
let tileHeight = 40;
let grid = [];
let cols = 10;
let rows = 10;

let tileTypes = ["grass", "dry", "path", "water"];
let tileWeights = [0.9, 0.1, 0, 0]
let hoveredTile = null;

function setUserAction(action) {
    console.log("set user action to: ", action)
    UserAction = action;
}
