// this file parses blog posts from a custom markdown into html

// make sure the picd header is valid, then get the info from it.
async function picdParseMeta(postsRoot, filename) {
    var filePromise = await fetch(postsRoot + filename);
    var fileText = await filePromise.text();
    var lines = fileText.split("\n");
    
    var obj = {};

    console.log(lines);

    var metaLen = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length == 0) { // TODO: ignore lines with whitespace only
            continue;
        } else if (lines[i][0] == '#') {
            const split = lines[i].indexOf(' ');
            const before = lines[i].slice(0, split); // includes the hash
            const after = lines[i].slice(split+1);
            console.log(before + " -> " + after);
            obj[before] = after;
        } else {
            metaLen = i;
            break;
        }
    }

    obj["__meta_len"] = metaLen;
    return obj;
}

async function parse(file_address, target_div) {
    // read file to str
    
    // parse string

    // add to div //TODO: just return?

}

// ------------------------------ //
// utils

function test() {
    picdParseMeta('https://earthensky.github.io/posts/', 'first.picd').then(obj => {
        console.log(obj["#title"]);
    });
}

//test();