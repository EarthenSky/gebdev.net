const fileBrowser = document.getElementById("file-browser");

const CELL_SIZE = 25;
const QUAD_CELL_SIZE = 4 * CELL_SIZE;

function createTBar() {
    let elem = document.createElement("div");
    elem.classList.add("t-bar");
    return elem;
}
function createVerticalBar() {
    let elem = document.createElement("div");
    elem.classList.add("vertical-bar");
    return elem;
}
function createAngleBar() {
    let elem = document.createElement("div");
    elem.classList.add("angle-bar");
    return elem;
}
function createBoldText(text) {
    let inner = document.createElement("span");
    inner.innerHTML = text;

    let text_item = document.createElement("div");
    text_item.classList.add("text-item");
    text_item.appendChild(inner);

    return text_item;
}
function createText(text) {
    let text_item = document.createElement("div");
    text_item.classList.add("text-item");
    text_item.innerHTML = text;
    return text_item;
}
function createLink(text, url) {
    let text_item = document.createElement("a");
    text_item.classList.add("text-item");
    text_item.href = url;
    text_item.innerHTML = text;
    return text_item;
}
/// @brief creates a row
function createNestedItem(elem, depth, is_last) {
    let item = document.createElement("div");
    item.classList.add("row");

    // TODO: this should be controlled upstream
    for (let i = 0; i < depth; i++)
        item.appendChild(createVerticalBar());

    item.appendChild(is_last ? createAngleBar() : createTBar());
    item.appendChild(elem);
    return item;
}

// --------------------------------------------------------- //
// icons

function createFolderIcon() {
    let icon = document.createElement("img");
    icon.style.cursor = "pointer";
    icon.style.filter = "var(--stars-on-black-filter)";
    icon.src = "/icons/folder-open.svg";
    icon.height = CELL_SIZE;
    icon.width  = CELL_SIZE;

    let item = document.createElement("div");
    item.classList.add("icon-item");
    item.appendChild(icon);

    return item;
}
// colour must be defined in colours.css as a variable
function createTagIcon(tag_name) {
    let colour = "tag-purple";
    if (tag_name == "recipe")
        colour = "tag-white"

    let tag = document.createElement("span");
    tag.style.cursor = "pointer";
    tag.style.height = "15px";
    tag.style.display = "inline-block";
    tag.style.fontSize = "0.75em";
    tag.style.padding = "2px 4px";
    tag.style.marginTop = "1.5px";
    tag.style.marginLeft = "6px";
    tag.style.borderWidth = "1.5px";
    tag.style.borderStyle = "solid";
    tag.style.borderColor = "var(--" + colour + ")"
    tag.style.color = "var(--" + colour + ")";
    tag.classList.add("tag");

    tag.innerHTML = tag_name;

    return tag;
}

// --------------------------------------------------------- //
// generating items

function generateMusicItems(json_list) {
    let margin = 4;
    let padding = 4;
    let size = QUAD_CELL_SIZE - padding*2 - margin*2;

    let music_items = [];
    for (const json of json_list) {
        let inner_text = document.createElement("span");
        inner_text.style.gridRow = "1";
        inner_text.style.gridColumn = "1";
        inner_text.style.marginTop = "auto";
        inner_text.style.fontSize = "0.85em";
        inner_text.classList.add("music-text");
        inner_text.style.color = "var(--soft-purple)";
        inner_text.innerHTML = json["title"];

        let play_icon = document.createElement("img");
        play_icon.src = "/icons/play.svg"; 
        play_icon.style.width  = CELL_SIZE + "px";
        play_icon.style.height = CELL_SIZE + "px";
        play_icon.style.display = "relative";
        play_icon.style.filter = "var(--stars-on-black-filter)";

        let second_layer = document.createElement("div");
        second_layer.style.gridRow = "1";
        second_layer.style.gridColumn = "1";
        second_layer.style.width = size + "px";
        second_layer.style.height = "100%";
        second_layer.style.display = "flex";
        second_layer.style.alignItems = "center";
        second_layer.style.justifyContent = "center";
        second_layer.appendChild(play_icon);

        let item = document.createElement("div");
        item.style.display = "grid";
        item.style.width = size + "px";
        item.style.height = size + "px";
        item.style.margin = margin + "px";
        item.style.padding = padding + "px";
        item.style.borderRadius = "4px";
        item.style.backgroundColor = "var(--black)";
        item.classList.add("music-item");
        item.appendChild(inner_text);
        item.appendChild(second_layer);

        // TODO: add support for playing the music

        music_items.push(item);
    }
    return music_items;
}

function generateLinkItems(json_list, depth) {
    let link_items = [];
    for (const json of json_list) {
        let row = createNestedItem(createLink("🔗 " + json["name"], json["url"]), depth, false); 
        link_items.push(row);

        if (json.hasOwnProperty("tags"))
            for (const tag_name of json["tags"])
                row.appendChild(createTagIcon(tag_name));
    }
    return link_items;
}

// --------------------------------------------------------- //

function generateRows(depth, json) {
    let rows = [];
    const json_keys = Object.keys(json);
    const num_keys = json_keys.length;
    for (let keyi = 0; keyi < num_keys; keyi++) {
        const category_key = json_keys[keyi];
        const value = json[category_key];

        if (Array.isArray(value)) {
            console.log("unexpected array!");
        } else if (!value.hasOwnProperty("kind")) {
            // "kind" is a special key, the absence of which means an object is a category, which recursively stores
            // further items
            let title_elem = createBoldText(category_key);
            rows.push(createNestedItem(title_elem, depth, keyi == num_keys-1));

            for (const item of generateRows(depth+1, json[category_key]))
                rows.push(item);

        } else {
            let title_elem = createBoldText(category_key);
            let row = createNestedItem(title_elem, depth, keyi == num_keys-1);
            rows.push(row);

            let rows_container = document.createElement("div");
            rows.push(rows_container);

            if (value.hasOwnProperty("properties") && value["properties"].indexOf("collapsible") != -1) {
                let icon = createFolderIcon();
                row.appendChild(icon);

                const original_display = new String(rows_container.style.display);
                icon.onclick = _ => {
                    // TODO: improve toggle performance
                    if (rows_container.style.display == original_display) {
                        rows_container.style.display = "none";
                        icon.firstChild.src = "/icons/folder.svg";
                    } else {
                        rows_container.style.display = original_display;
                        icon.firstChild.src = "/icons/folder-open.svg";
                    }
                };
            }

            if (value["kind"] == "text") {
                // non-categories are leaf nodes & contain rich data
                let text_elem = createText(value["text"]);
                let text_row = createNestedItem(text_elem, depth+1, true);
                rows_container.appendChild(text_row);

            } else if (value["kind"] == "music") {
                let music_container = document.createElement("div");
                music_container.style.display = "flex";
                music_container.style.flexDirection = "row";
                music_container.style.width = "100%";
                music_container.style.marginLeft = ((depth+1) * 25) + "px";

                for (let item of generateMusicItems(value["items"]))
                    music_container.appendChild(item);

                // TODO: deal with the lines on the RHS
                rows_container.appendChild(music_container);

            } else if (value["kind"] == "links") {
                for (let item of generateLinkItems(value["items"], depth+1))
                    rows_container.appendChild(item);

            } else if (value["kind"] == "art") {
            
            }

        }
    }

    return rows;
}

async function loadFileBrowser() {
    const response = await fetch("/data/things.json");
    if (!response.ok) {
        fileBrowser.innerHTML = "oops! Couldn't find things.json, so I'm not sure what files are out there..."
    } else {
        response_json = await response.json();
        console.log(response_json);

        // TODO: switch to loading by row async, so response time is smaller!
        for (const row_or_rows of generateRows(0, response_json)) {
            fileBrowser.append(row_or_rows);
        }
    }
}

loadFileBrowser();
