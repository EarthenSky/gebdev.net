class MyBlock {  // NitroBlock will be the name in both instances
    getInfo() {
        return {
            "id": "MyBlock",
            "name": "MyBlock",
            "blocks": [{
                "opcode": "substringy", //This will be the ID code for the block
                "blockType": "reporter", //This can either be Boolean, reporter, command, or hat
                "text": "letters [num1] through [num2] of [string]", //This is the block text, and how it will display in the Scratch interface
                "arguments": { //Arguments are the input fields in the block. In the block text, place arguments in square brackets with the corresponding ID 
                    "num1": { //This is the ID for your argument
                        "type": "number", //This can be either Boolean, number, or string
                        "defaultValue": "3" //This is the default text that will appear in the input field, you can leave this blank if you wish
                    },
                    "num2": {
                        "type": "number",
                        "defaultValue": "14"
                    },
                    "string": {
                        "type": "string",
                        "defaultValue": "hello world"
                    }
                }
            }],
            "menus": { // we will get back to this in a later tutorial
            }
        };
    }
    // Make sure you name this function with with the proper ID for the block you defined above
    substringy({num1, num2, string}) { // these names will match the argument names you used earlier, and will be used as the variables in your code
        // this code can be anything you want
        return string.substring(num1 - 1, num2);  //for reporters and Boolean blocks the important thing is to use 'return' to get the value back into Scratch.
    }
}
Scratch.extensions.register(new MyBlock());




