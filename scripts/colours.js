// TODO: load colours from cookies

visibleColorProperties = {
    frontHard: "#e9efe9",
    frontSoft: "#8b8f8b",
    back: "#2f3335",

    color1High: "#c3dd66", 
    color1Mid: "#87ce3c", 
    color1Low: "#3f8d4c", 
  
    color2High: "#8af1c6", 
    color2Mid: "#26d399", 
    color2Low: "#2e8f6f", 
}

savedColorProperties = {
    frontHard: "#e9efe9",
    frontSoft: "#8b8f8b",
    back: "#2f3335",

    color1High: "#c3dd66", 
    color1Mid: "#87ce3c", 
    color1Low: "#3f8d4c", 
  
    color2High: "#8af1c6", 
    color2Mid: "#26d399", 
    color2Low: "#2e8f6f", 
};

forestColor = {
    frontHard: "#e9efe9",
    frontSoft: "#8b8f8b",
    back: "#2f3335",

    color1High: "#c3dd66", 
    color1Mid: "#87ce3c", 
    color1Low: "#3f8d4c", 
  
    color2High: "#8af1c6", 
    color2Mid: "#26d399", 
    color2Low: "#2e8f6f", 
};

oceanColor = {
    frontHard: "#212123",
    frontSoft: "#8b8f8b",
    back: "#f2f0e5",

    color1High: "#4b80ca", 
    color1Mid: "#28ccdf", 
    color1Low: "#a2dcc7", 
  
    color2High: "#ffb879", 
    color2Mid: "#ea6262", 
    color2Low: "#f47e1b", 
};

function changeDocumentColors(xColor) {
    document.documentElement.style.setProperty("--front-hard", xColor.frontHard);
    document.documentElement.style.setProperty("--front-soft", xColor.frontSoft);
    document.documentElement.style.setProperty("--back", xColor.back);

    document.documentElement.style.setProperty("--color1-high", xColor.color1High);
    document.documentElement.style.setProperty("--color1-mid", xColor.color1Mid);
    document.documentElement.style.setProperty("--color1-low", xColor.color1Low);
    
    document.documentElement.style.setProperty("--color2-high", xColor.color2High);
    document.documentElement.style.setProperty("--color2-mid", xColor.color2Mid);
    document.documentElement.style.setProperty("--color2-low", xColor.color2Low);
    
    visibleColorProperties = xColor;
}

function setSavedColor(xColor) {
    savedColorProperties.frontHard = xColor.frontHard;
    savedColorProperties.frontSoft = xColor.frontSoft;
    savedColorProperties.back = xColor.back;

    savedColorProperties.color1High = xColor.color1High;
    savedColorProperties.color1Mid = xColor.color1Mid;
    savedColorProperties.color1Low = xColor.color1Low;

    savedColorProperties.color2High = xColor.color2High;
    savedColorProperties.color2Mid = xColor.color2Mid;
    savedColorProperties.color2Low = xColor.color2Low;
}

// -------------------- //
// color util

// from https://stackoverflow.com/questions/66123016/interpolate-between-two-colours-based-on-a-percentage-value
function colorLerp(col1, col2, p) {
    function toArray(rgb) {
        const r = rgb >> 16;
        const g = (rgb >> 8) % 256;
        const b = rgb % 256;
        return [r, g, b];
    }

    // remove leading hash
    const rgb1 = parseInt(col1.slice(1), 16);
    const rgb2 = parseInt(col2.slice(1), 16);
  
    const [r1, g1, b1] = toArray(rgb1);
    const [r2, g2, b2] = toArray(rgb2);
  
    const q = 1 - p;
    const rr = Math.round(r1 * p + r2 * q);
    const rg = Math.round(g1 * p + g2 * q);
    const rb = Math.round(b1 * p + b2 * q);
  
    return "#" + Number((rr << 16) + (rg << 8) + rb).toString(16);
}

function colorPropertyLerp(colProp1, colProp2, p) {
    return {
        frontHard: colorLerp(colProp1.frontHard, colProp2.frontHard, p),
        frontSoft: colorLerp(colProp1.frontSoft, colProp2.frontSoft, p),
        back:      colorLerp(colProp1.back, colProp2.back, p),

        color1High: colorLerp(colProp1.color1High, colProp2.color1High, p), 
        color1Mid:  colorLerp(colProp1.color1Mid, colProp2.color1Mid, p), 
        color1Low:  colorLerp(colProp1.color1Low, colProp2.color1Low, p), 
    
        color2High: colorLerp(colProp1.color2High, colProp2.color2High, p), 
        color2Mid:  colorLerp(colProp1.color2Mid, colProp2.color2Mid, p), 
        color2Low:  colorLerp(colProp1.color2Low, colProp2.color2Low, p), 
    };
}

const LERP_TIME_ITERS = 25;

// --------------------- //
// forest

var forestIter = 0;
var forestTimer = null;
function forestUpdate() {
    if (forestIter <= LERP_TIME_ITERS) {
        document.getElementById("select-forest").firstElementChild.style.setProperty("width", (forestIter * (100/LERP_TIME_ITERS)) + "%");

        // lerp colours
        var p = forestIter / LERP_TIME_ITERS;
        changeDocumentColors(colorPropertyLerp(forestColor, savedColorProperties, p));

        forestIter += 1;
    } else {
        forestIter = 0;
        
        clearInterval(forestTimer);
        forestTimer = setInterval(forestRevertBar, 20);
    }
}

function triggerForestRevertBar() {
    clearInterval(forestTimer);
    forestIter = 0;
    forestTimer = setInterval(forestRevertBar, 20);
}

var forestBarStartingWidth = 0;
function forestRevertBar() {
    if (forestIter == 0) {
        forestBarStartingWidth = parseInt(document.getElementById("select-forest").firstElementChild.style.getPropertyValue("width"));
        forestIter += 1;
    } else if (forestIter <= LERP_TIME_ITERS) {
        document.getElementById("select-forest").firstElementChild.style.setProperty(
            "width", 
            (forestBarStartingWidth - (forestIter * (forestBarStartingWidth / LERP_TIME_ITERS))) + "%"
        );
        forestIter += 1;
    } else {
        document.getElementById("select-forest").firstElementChild.style.setProperty("width", "0%");
        triggerForestRevertBar();
    }
}

document.getElementById("select-forest").addEventListener("mousedown", (event) => {
    triggerOceanRevertBar();
    clearInterval(forestTimer);

    forestIter = 0;
    setSavedColor(visibleColorProperties);
    
    forestTimer = setInterval(forestUpdate, 20);
});

// TODO: make these into instances of a class

// --------------------- //
// ocean

var oceanIter = 0;
var oceanTimer = null;
function oceanUpdate() {
    if (oceanIter <= LERP_TIME_ITERS) {
        document.getElementById("select-ocean").firstElementChild.style.setProperty("width", (oceanIter * (100/LERP_TIME_ITERS)) + "%");
        
        // lerp colours
        var p = oceanIter / LERP_TIME_ITERS;
        changeDocumentColors(colorPropertyLerp(oceanColor, savedColorProperties, p));

        oceanIter += 1;
    } else {
        triggerOceanRevertBar();
    }
}

function triggerOceanRevertBar() {
    clearInterval(oceanTimer);
    oceanIter = 0;
    oceanTimer = setInterval(oceanRevertBar, 20);
}

var oceanBarStartingWidth = 0;
function oceanRevertBar() {
    if (oceanIter == 0) {
        oceanBarStartingWidth = parseInt(document.getElementById("select-ocean").firstElementChild.style.getPropertyValue("width"));
        oceanIter += 1;
    } else if (oceanIter <= LERP_TIME_ITERS) {
        document.getElementById("select-ocean").firstElementChild.style.setProperty(
            "width", 
            (oceanBarStartingWidth - (oceanIter * (oceanBarStartingWidth / LERP_TIME_ITERS))) + "%"
        );
        oceanIter += 1;
    } else {
        document.getElementById("select-ocean").firstElementChild.style.setProperty("width", "0%");
        triggerOceanRevertBar();
    }
}

// TODO: rethink this implementation as a regular light/dark mode, not too fancy of one
/*
document.getElementById("select-ocean").addEventListener("mousedown", (event) => {
    triggerForestRevertBar();
    clearInterval(oceanTimer);

    oceanIter = 0;
    setSavedColor(visibleColorProperties);
    
    oceanTimer = setInterval(oceanUpdate, 20);
});
*/
