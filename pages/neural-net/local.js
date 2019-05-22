function main() {
    // Load text file.
    // Setup network.
    // Train network.
}

// For this implementation, output is how good a word is: 1=best, 0=worst
//sigmoid(a*in+b)

//in = sum of (weights_y*input_y)
//new:
// out = sigmoid(sum_y of w_y*input_y)
// x - x \
// x - x - o
// x - x /

// activation function (works best?)
function activationf(in) {
    return max(0, in)
}

let so1 = [0.5];  // output values
let so2 = [];

//let si1 = [];  // input values
//let si2 = [];

let wt = [1, 1, 1, 1, 1, 1, 1, 1];  // This is a list of weights.
let wi = 0;  // weight index -- weights passed
let b = [-1, -1, -1, -1];  // This is a list of biases. (all nodes, excluding inputs and outputs)
let bi = 0;  // weight index -- weights passed

let INPUT_NODES = s1.length; // type: float
let OUTPUT_NODES = 1;  //
let HIDDEN_LAYER_SIZE = 2;  //5;  // height
let HIDDEN_LAYER_DEPTH = 2;  //5;
function startTraining() {
    let rep = HIDDEN_LAYER_DEPTH+1;  // repetitions
    for (i=0; i<rep; i++) {
        // predicted size of next set of perceptrons.
        let s2len = (i==rep-1 ? OUTPUT_NODES : HIDDEN_LAYER_SIZE);

        for(l=0; l<s2len; l++) {  //s2 loop
            // find weighted sum to send to perceptron 'n' of the next set.
            let psum = 0;
            for(j=0; j<s1.length; j++) {  //s1 loop
                psum += wt[wi]*so1[j];
                wi+=1;
            }

            so2.push( activationf(psum) + b[bi] );
            bi++;

        }
        //todo: does this work
        so1 = so2
        so2 = []
        // swap adresses of s01 & s02
    }

}
