function onStart() { }

//TODO: make this do some more complicated maths, it only does each number once.

// this is the main function.
function factorPolynomial() {
    // Get polynomial / function and process.
    var polynomialStr = document.getElementById('main-input').value;
    func = polynomialStr.replace(/\^/g, '**');

    //find k first. (Const value at end.)
    var n = func.lastIndexOf("x");
    var k = parseInt(func.substring(n+1, func.length).replace(/ /g,''))

    factorList = findFactors(k);
    outFactorList = [];

    // Check each factor with the formula.
    for (var i = 0; i < factorList.length; i++) {
        // evaluate the positive and negitave value of each factor.
        //alert( func.replace( /x\*\*/g, factorList[i]+'**' ).replace( /x/g, factorList[i] ) )
        //alert(eval(func.replace( /x\*\*/g, '*'+factorList[i]+'**' ).replace( /x/g, factorList[i] )))
        if (eval(func.replace( /x\*\*/g, factorList[i]+'**' ).replace( /x/g, factorList[i] )) === 0) {
            outFactorList.push( factorList[i] );
        }
        if (eval(func.replace( /x\*\*/g, '('+(-factorList[i])+')**' ).replace( /x/g, '('+(-factorList[i])+')' )) === 0) {
            outFactorList.push( -factorList[i] );
        }
    }

    // Create the mathematical notated output.
    outStr = ""
    for (var i = 0; i < outFactorList.length; i++) {
        if (i < 0)
            outStr += "(x"+(outFactorList[i]*-1)+")";
        else
            outStr += "(x+"+(outFactorList[i]*-1)+")";
    }

    if (outFactorList.length == 0) {
        document.getElementById('output').value = "error";
    }

    document.getElementById('output').value = outStr;
}

// Finds the positive factors of abs(inputNumber).
function findFactors(intNum) {
    intNum = Math.abs(intNum);  // use absolute value of number

    outList = [];

    var half = Math.floor(intNum / 2), // Ensures a whole number <= num.
        i, j;

    outList.push(1);  // 1 will be a part of every solution.

    // Determine our increment value for the loop and starting point.
    intNum % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);

    for (i; i <= half; i += j) {
        intNum % i === 0 ? outList.push(i) : false;
    }

    //str += ',' + intNum;
    outList.push(intNum);  // Always include the original number.

    return outList;
}
