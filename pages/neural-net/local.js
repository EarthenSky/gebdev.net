// Check for the various File API support.
if ((window.File && window.FileReader && window.FileList) == false) {
    alert('The File APIs are not fully supported in this browser!');
}

wordBankList = [];
function handleFileSelect(evt) {
    let files = evt.target.files;  // FileList object

    // files is a FileList of File objects. List some properties.
    let output = [];
    let reader = new FileReader();
    let f = files[0];

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) { wordBankList = e.target.result.split("\n") };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function isFileLoaded() {
    if (wordBankList.length == 0) {
        return 1;
    } else {
        return 0;
    }
}

document.getElementById('word-bank-upload').addEventListener('change', handleFileSelect, false);

// ~constants
let INPUT_NODES = 32; // scaled between (0, 1) at 26 different values.
let HIDDEN_LAYER_SIZE = parseInt(document.getElementById('hls').value);
let HIDDEN_LAYER_DEPTH = parseInt(document.getElementById('hld').value);
let OUTPUT_NODES = 1;  // output neurons

// This is called when the network activate button is pressed. "train network"
function main() {
    // Setup network.
    if (isFileLoaded() == 1) {
        alert ("file not loaded");
        return;
    }

    // Interperet test data. (process into usable form)
    let testDataLines = document.getElementById('test-words').value.split("\n");
    let testData = [];  // will be 2d array.
    for (i=0; i<testDataLines.length; i++) {
        values = testDataLines[i].split(" : ");  // [word, intended value] ex: [car, 1]
        testData.push(values);
    }

    // --------------------------------------------------------------------- //

    // Setup network.
    let INPUT_NODES = 32; // scaled between (0, 1) at 26 different values.
    let HIDDEN_LAYER_SIZE = parseInt(document.getElementById('hls').value);
    let HIDDEN_LAYER_DEPTH = parseInt(document.getElementById('hld').value);
    let OUTPUT_NODES = 1;  // outputss

    // TODO: do i need to pass these down?
    let so1 = [];  // the initial value of this is the input node count  //stack out #1
    let so2 = [];

    let wSize = 0;
    for (i=0; i<HIDDEN_LAYER_DEPTH+1; i++) {
        // predicted size sets of perceptrons.
        let s2len = (i==HIDDEN_LAYER_DEPTH ? OUTPUT_NODES : HIDDEN_LAYER_SIZE);
        let s1len = (i==0 ? INPUT_NODES : HIDDEN_LAYER_SIZE);
        wSize += s1len * s2len;
    }
    let wt = [...Array(wSize).keys()].map(i => 0);

    // This is a list of biases. (all nodes, excluding inputs and outputs)
    let biasCount = HIDDEN_LAYER_SIZE*HIDDEN_LAYER_DEPTH;
    let b = [...Array(biasCount).keys()].map(i => 0);

    // Each item is randomly initialized over the range (-1, 1).
    randomizeVariables(wt, b);

    // TODO: make sure these dont get randomized a second time.
    let wtOld = wt;
    let bOld = b;

    // Calculate initial cost value.
    let totalCost = [findTotalCost(testData, so1, so2, wt, b)];  // [] so totalCost can pass by reference.

    // This is to prepare the data for looping, so that the next cost value
    // will be different thus a change in cost can be calculated.
    randomizeVariables(wt, b);

    // --------------------------------------------------------------------- //

    // Train network. (aka: "Gradient Descent")
    let interations = parseInt(document.getElementById('sig-iter').value);
    for(j=0; j<interations; j++) {
        updateVariables(totalCost, testData, so1, so2, wt, b);  // Update weights and biases
        document.getElementById('tout').innerHTML += "totalCost=${totalCost} @ iter=${j} <br>";
    }

    // --------------------------------------------------------------------- //

    // Evaluate Network on large dataset and get output in multiline input.
    let wordBankDict = {};  // Save data in a dictionary.
    for(k=0; k<wordBankList.length; k++) {
        //TOOO: this!!!!!!!!!1
        wordBankDict[wordBankList[k]] = runNetwork(wordToList(wordBankList[k]), so2, wt, b)[0];
    }

    // sort items.
    wordBankDict.sort();

    for(k=0; k<wordBankList.length; k++) {
        //TOOO: this!!!!!!!!!1
        document.getElementById('tout').innerHTML += "word : value \n";
    }

    // send output.

}

// For this implementation, output is how good a word is: 1=best, 0=worst

// inc/dec the values of wt and b by '+-1'
function randomizeVariables(wt, b) {
    wt = wt.map(i => i + (Math.random()*2)-1);
    b = b.map(i => i + (Math.random()*2)-1);
}


// find the change in cost over all test data.
function updateVariables(cost, testData, so1, so2, wt, b, wtOld, bOld) {
    let newCost = [findTotalCost(testData, so1, so2, wt, b)];
    let dCost = cost - newCost;
    let cost[0] = newCost[0];  // these are both objects so therefore cost is affected.

    let wtNew = [];
    let bNew = [];

    //calculate gradients of wt and b.
    for(a=0; a< ; a++) {
        wtNew[a] = wtOld[a] - wt[a]
    }

    for(b=0; b< ; b++) {
        bNew[a] = btOld[a]
    }

    //update variable containers.
    wtOld = wt;
    bOld = b;
    wt = wtNew;
    b = bNew;
}

// run network for each so1 (word) in the multiline input and find average of all of them.
function findTotalCost(testData, so1, so2, wt, b) {
    let totalAvgCost = 0  // an average over all test data.
    console.log("testdata length: " + testData.length);
    for(h=0; h<testData.length; h++) {
        console.log(h + "--");
        // findCost(...) must be positive b/c is sum of abs(n),
        // therefore no need to do: abs(findCosts(...))
        totalAvgCost += findCost(testData[i][1], wordToList(testData[i][0]), so2, wt, b);
    }
    return totalAvgCost/testData.length;
}

// This function implements 'INPUT_NODES'.
function wordToList(str) {
    outlist = [];
    if (str.length > 32) { console.log("length error: string greater than 32 characters") }
    for (a=0; a<INPUT_NODES; a++) {
        if (a >= str.length) {
            outlist.push(-1); // fill all other characters with -1.
        } else {
            outlist.push(str.charCodeAt(a)/256);  // Keeps value between [0, 1) ?
        }
    }
    return outlist;
}

// ivs stands for Intended ValueS. (size of ivs is output neuron count.)
// (for this implementation ivs will be a list of a single variable)
/// This function returns a single variable no matter what.
function findCost(ivs, so1, so2, wt, b) {
    cvs = runNetwork(so1, so2, wt, b);  // cvs stands for Calculated ValueS.

    //TODO: SOMETHING IS WRONG HERE!!!!!!!!!!!

    // Get sum of absolute value of variance from intended outputs.
    let cost = 0
    for(j=0; j<so1.length; j++) {
        cost += Math.abs(ivs[j] - so1[j]);  // Find variance from intended output.
    }

    return cost/so1.length;  // avgCost -> must be positive b/c sum of abs(n)
}

// this is the only place the activation function is called.
// this function returns an array of all the output neuron values.
function runNetwork(so1, so2, wt, b) {
    let rep = HIDDEN_LAYER_DEPTH+1;  // repetitions

    let wi = 0;  // weight index -- weights passed
    let bi = 0;  // bias index -- biases passed
    for (i=0; i<rep; i++) {
        // predicted size of next set of perceptrons.
        let s2len = (i==rep-1 ? OUTPUT_NODES : HIDDEN_LAYER_SIZE);

        for(l=0; l<s2len; l++) {  //s2 loop
            // find weighted sum to send to perceptron 'n' of the next set.
            let psum = 0;
            for(j=0; j<so1.length; j++) {  //s1 loop
                psum += wt[wi]*so1[j];
                wi++;
            }

            so2.push( activationf(psum + b[bi]) );
            bi++;
        }

        // Move to next layer
        so1 = so2;
        so2 = [];
    }

    return so1;
}

// activation function (this is RELU b/c is best?) -> RELU seems faster than sigmoid.
function activationf(x) {
    return Math.max(0, x);
}

/*
iridescent : 1
effervescence : 1
orth : 1
abyss : 1
archon : 1
tempest : 1
templar : 1
alchemic : 1
unknown : 1
wizardry : 1
zenith : 1
ultimate : 1
wyvern : 1
tarragon : 1
calamity : 1
azure : 1
beryl : 1
malachite : 1
sage : 1
cobalt : 1
cerulean : 1
welkin : 1
zephyr : 1
ultramarine : 1
aura : 1
chaotic : 1
cartography : 1
relic : 1
swordsman : 1s
deeps : 1
bologna : 0
lugubrious : 0
curd : 0
*/
