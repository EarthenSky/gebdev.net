function onStart() {
    console.log("Start Gravity!");
}


// This function fills in the input boxes using math.
function completeBoxes() {
    // Get contents for all boxes.
    var gfield = document.getElementById("gfield").value;
    var M = document.getElementById("M").value;
    var r = document.getElementById("r").value;

    // Switches.
    var gfield_is_empty = false;
    var M_is_empty = false;
    var r_is_empty = false;

    // Check for valid contents.
    if ( gfield === "" || isNaN(gfield) ) { gfield_is_empty = true; }
    if ( M === "" || isNaN(M) ) { M_is_empty = true; }
    if ( r === "" || isNaN(r) ) { r_is_empty = true; }

    var emptyBoxes = gfield_is_empty + M_is_empty + r_is_empty;
    //console.log("emptyBoxes: " + emptyBoxes);

    // Case: cannot solve; exit function.
    if (emptyBoxes >= 2 || emptyBoxes == 0) { return; }

    const G_CONSTANT = 6.67408 * Math.pow(10, -11);  // Gravitational Constant.

    // Do calculation for empty box.
    if (gfield_is_empty) {
        document.getElementById("gfield").value = (G_CONSTANT * M) / (r * r);
    } else if (M_is_empty) {
        document.getElementById("M").value = (gfield * r * r) / G_CONSTANT;
    } else if (r_is_empty) {
        if (gfield / (G_CONSTANT * M) < 0)
            document.getElementById("r").value = "undefined";
        else
            document.getElementById("r").value = Math.sqrt(gfield / (G_CONSTANT * M));
    }
}
