function init() {
    switchToCurrentPage();    

}

var currentBlogPostListHash = null;
function initBlog() {
    // parse headers of all posts
    queryListOfPosts().then(postList => {
        console.log(postList);

        var newPostListHash = "";
        for (const postJson of postList) {
            newPostListHash += postJson.sha + " => "
        }
        
        if (currentBlogPostListHash == newPostListHash)
            return; // case: it looks like what we got is the same as our current list, so don't re-generate.
        
        currentBlogPostListHash = newPostListHash;
        document.getElementById("post-list").innerHTML = ""; // emptied
        //TODO: set the content here to be the pico.css waiting thingy

        for (const postJson of postList) {
            picdParseMeta('https://earthensky.github.io/posts/', postJson.name).then(meta => {
                var currentArticle = "";
                console.log(meta);
                currentArticle += '<article class="thin-article close-margin">';
                currentArticle += '<div class="grid">';
                currentArticle += '<h4 class="thin-p">' + meta["#title"] + '</h4>';
                currentArticle += '<p>' + meta["#subtitle"] + '</p>';
                // TODO: change from svg-logo to a custom attribute
                currentArticle += '<img src="posts/' + meta["#img"] + '" class="svg-logo" style="justify-self: end;"/>';
                currentArticle += '</div>';
                currentArticle += '<p class="thin-p"> <img src="res/clock.svg" class="svg-icon"/> ' + meta["#date"] + '</p>';
                currentArticle += '</article>';
                document.getElementById("post-list").innerHTML += "\n" + currentArticle;
            });
        }

        // TODO: make sure to sort document.getElementById("post-list") by date or something, b/c we can't guarentee order of promises.
    });

    // TODO: set the initial content (before everything) to be the waiting thingy until this await finishes.
}

function exitBlog() {
    // do nothing lol :c
}

// ------------------------------------------ //
// functions

// when the window hash becomes new
window.onhashchange = switchToCurrentPage; 
function switchToCurrentPage() { 
    if(window.location.hash) {
        if (window.location.hash === "#blog") {
            updatePageVisiblity(false, true, false, false);
        } else if (window.location.hash === "#projects") {
            updatePageVisiblity(false, false, true, false);
        } else if (window.location.hash === "#todo") {
            updatePageVisiblity(false, false, false, true);
        } else {
            window.location.hash = "";
            updatePageVisiblity(true, false, false, false);
        }
    } else {
        updatePageVisiblity(true, false, false, false);
    }
}

function updatePageVisiblity(home, blog, projects, todo) {
    var last;
    if (document.getElementById("home").hidden)
        last = "home";
    else if (document.getElementById("blog").hidden)
        last = "blog";
    else if (document.getElementById("projects").hidden)
        last = "projects";
    else if (document.getElementById("todo").hidden)
        last = "todo";

    // show/hide tags

    document.getElementById("home").hidden = !home;
    document.getElementById("blog").hidden = !blog;
    document.getElementById("projects").hidden = !projects;
    document.getElementById("todo").hidden = !todo;

    // init/exit pages

    if (blog) {
        initBlog();
    } else if (last == "blog") {
        exitBlog();
    }
}

async function queryListOfPosts() {
    // api request string to get directory contents of github repo
    const postsListUrl = "https://api.github.com/repos/EarthenSky/earthensky.github.io/contents/posts/"; 
    // alternative https://api.github.com/repositories/98707960/contents/posts
    
    // download text
    const response = await fetch(postsListUrl);
    var jsonText = await response.json();
    jsonText = jsonText.filter(jsonResult => jsonResult.type != "dir");

    // returns list of objects
    return jsonText;
}

// ------------------------------------------ //
// main 

init()