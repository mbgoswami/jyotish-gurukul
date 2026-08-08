const categoryList = document.getElementById("categoryList");

let library = [];

let allChildContainers = [];
let allFolderItems = [];

let totalFolders = 0;
let totalFiles = 0;
let newFiles = 0;
let updatedFiles = 0;

let selectedFolder = null;
let visibleFolders = [];
let keyboardIndex = -1;

console.log(categoryList);

async function loadLibrary(){

    const response = await fetch("library.json");

    library = await response.json();

}

loadLibrary().then(() => {

    buildCategoryList();

    categorySearchInput.focus();

});

function buildTreeData() {

    const tree = {};

    library.forEach(item => {

        let current = tree;

        item.path.forEach(level => {

            if (!current[level]) {

                current[level] = {
                    folders: {},
                    files: []
                };

            }

            current = current[level].folders;

        });

        // अंतिम Folder में File जोड़ें

        const lastLevel = item.path[item.path.length - 1];

        let node = tree;

        item.path.forEach(level => {

            node = node[level];

            if (level !== lastLevel) {

                node = node.folders;

            }

        });

        node.files.push(item);

    });

    return tree;

}

function getCategoryIcon(name) {

    const icons = {

        "Nakshatra": "⭐",
        "Graha": "🪐",
        "Bhava": "🏠",
        "Rashi": "♈",
        "Yogas": "🧘",
        "Dasha": "⏳",
        "Books": "📚",
        "Personal Notes": "📝"

    };

    return icons[name] || "📂";

}

function drawTree(node, parentElement, currentPath = []) {

    Object.keys(node).forEach(key => {

        const folderPath = [...currentPath, key];

        const folder = node[key];

        // Folder Row
        const item = document.createElement("div");

        item.style.borderRadius = "6px";
        item.style.padding = "4px 8px";

        item.className = "categoryItem";

        const icon = currentPath.length === 0
        ? getCategoryIcon(key)
        : "📂";

        item.innerHTML = "▶ " + icon + " " + key;

        parentElement.appendChild(item);

        // Child Container
        const childContainer = document.createElement("div");
        allChildContainers.push(childContainer);
        
        
        allFolderItems.push({
    item,
    icon,
    key,
    childContainer,
    folderPath,
    folder
});

        childContainer.style.paddingLeft = "20px";

        childContainer.style.display = "none";

        parentElement.appendChild(childContainer);

        // Expand / Collapse
        item.onclick = () => {

    // Remove previous selection
    if (selectedFolder) {
        selectedFolder.style.background = "";
        selectedFolder.style.color = "";
    }

    // Select current folder
    selectedFolder = item;
    item.style.background = "#dbeafe";
    item.style.color = "#1d4ed8";

    // Expand / Collapse
    if (childContainer.style.display === "none") {

        childContainer.style.display = "block";
        item.innerHTML = "▼ " + icon + " " + key;

    } else {

        childContainer.style.display = "none";
        item.innerHTML = "▶ " + icon + " " + key;

    }
    

    // Right Panel
    showFolderFiles(folder, folderPath.join(" > "));

};

        // Recursive Call
        drawTree(folder.folders, childContainer, folderPath);

    });

}

function createFileCard(file) {

    const card = document.createElement("div");
    card.style.background = "#ffffff";

    card.style.border = "1px solid #dcdcdc";

    card.style.borderRadius = "10px";

    card.style.padding = "15px";

    card.style.marginBottom = "15px";

    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    card.className = "fileCard";

    // ---------- Title ----------

    const title = document.createElement("h3");
    title.style.margin = "0 0 8px 0";
    title.style.color = "#1f2937";
    title.style.fontSize = "22px";
    title.style.fontWeight = "600";
    title.style.lineHeight = "1.3";
    
    
// title.textContent = (icons[ext] || "📄") + " " + file.title;
title.textContent = "📄 " + file.title;
    
   card.appendChild(title);
    // ---------- Path ----------

const path = document.createElement("p");

// path.style.fontSize = "13px";
// path.style.color = "#888";
// path.style.marginTop = "-6px";
// path.style.marginBottom = "12px";

path.style.fontSize = "12px";
path.style.color = "#777";
path.style.margin = "0 0 12px 0";
path.style.display = "block";
path.innerHTML = "📍 " + file.path.join(" > ");

card.appendChild(path);
card.appendChild(document.createElement("hr"));

    
    // ---------- File Information ----------

const icons = {
    PDF: "📕",
    JPG: "🖼️",
    JPEG: "🖼️",
    PNG: "🖼️",
    GIF: "🖼️",
    DOC: "📘",
    DOCX: "📘",
    XLS: "📊",
    XLSX: "📊",
    PPT: "📽️",
    PPTX: "📽️",
    MP3: "🎵",
    MP4: "🎬",
    ZIP: "📦"
};

const ext = file.filename.split(".").pop().toUpperCase();

const info = document.createElement("div");

info.style.margin = "10px 0";

info.innerHTML = `

<span style="
background:#eaf3ff;
padding:4px 8px;
border-radius:5px;
font-size:12px;
font-weight:bold;
">
${icons[ext] || "📄"} ${ext}
</span>

&nbsp;&nbsp;

🌐 ${file.language || "-"}

&nbsp;&nbsp;

📖 ${file.pages || 0} Pages

`;

card.appendChild(info);

    // ---------- Related ----------

if (file.related && file.related.length > 0) {

    const relatedTitle = document.createElement("p");

    relatedTitle.innerHTML = "⭐ <b>Related Topics</b>";

    card.appendChild(relatedTitle);

    const relatedBox = document.createElement("div");

    relatedBox.style.marginBottom = "10px";

    file.related.forEach(topic => {

        const tag = document.createElement("button");

        tag.textContent = topic;

        tag.style.margin = "3px";
        tag.style.padding = "4px 8px";
        tag.style.cursor = "pointer";

        tag.onclick = function () {

            document.getElementById("fileSearchInput").value = topic;

            searchFiles();

        };

        relatedBox.appendChild(tag);

    });

    card.appendChild(relatedBox);

}

    // ---------- Button ----------

    const button = document.createElement("button");

    button.textContent = "📂 Open File";

    button.onclick = function () {

        openFile(file);

    };

    card.appendChild(button);

    return card;

}

    // Just changed
    function countAllFiles(folder) {

    let total = folder.files.length;

    Object.values(folder.folders).forEach(sub => {

        total += countAllFiles(sub);

    });

    return total;

}

function showFolderFiles(folder, folderName) {

    currentFolder = folder;
    currentFolderName = folderName;

    contentArea.innerHTML = "";
    
    const files = folder.files;

    const subFolders = Object.keys(folder.folders);

    const totalFiles = countAllFiles(folder);

    // Header

    const header = document.createElement("h2");
    header.innerHTML = "📂 " + folderName;
    contentArea.appendChild(header);

    // File Count

    const count = document.createElement("p");
    count.innerHTML =
`
📁 Subfolders : <b>${subFolders.length}</b>
&nbsp;&nbsp;&nbsp;
📄 Total Files : <b>${totalFiles}</b>
`;
    contentArea.appendChild(count);

    // Empty Folder

    if (files.length === 0 && subFolders.length === 0) {

    const empty = document.createElement("p");

    empty.innerHTML = "📂 This folder is empty.";

    contentArea.appendChild(empty);

    return;

}

    // File Cards

    files.forEach(file => {

        contentArea.appendChild(

            createFileCard(file)

        );

    });

}

function buildCategoryList() {

    categoryList.innerHTML = "";

    const tree = buildTreeData();

    drawTree(tree, categoryList);

}

function showSubCategory(category, subcategory){

    const files = library.filter(item =>

        item.category === category &&
        item.subcategory === subcategory

    );

    let html = `
        <div class="contentHeader">
            <h2>${subcategory}</h2>
            <p>Total Files : ${files.length}</p>
        </div>
    `;

    files.forEach(file => {

        html += `
            <div class="fileItem"
                onclick="window.open('${file.filepath}','_blank')">

                📄 ${file.title}

            </div>
        `;

    });

    document.getElementById("contentArea").innerHTML = html;

}

function openFile(file){

    document.getElementById("fileViewer").src = file.filepath;

    document.getElementById("viewerArea").style.display = "block";

    document.getElementById("contentArea").style.display = "none";

}

function filterTree() {

    visibleFolders = [];
    keyboardIndex = -1;

    const text = categorySearchInput.value.trim().toLowerCase();
    
    if (text === "") {

        allFolderItems.forEach(f => {

            f.item.style.display = "";

            f.childContainer.style.display = "none";

            f.item.innerHTML = "▶ " + f.icon + " " + f.key;

        });

        return;
    }

    allFolderItems.forEach(f => {

        let found = false;

        // Folder Name
        if (f.key.toLowerCase().includes(text)) {

            found = true;

        }

        // File Name Search
        
        if (!found) {

            found = folderContainsText(f.folder, text);

        }

        if (found) {

            visibleFolders.push(f);

            f.item.style.display = "";

            f.childContainer.style.display = "block";

            f.item.innerHTML = "▼ " + f.icon + " " + f.key;

        } else {

            f.item.style.display = "none";

            f.childContainer.style.display = "none";

        }

    });

}

function folderContainsText(folder, text) {

    // Folder की अपनी Files
    if (folder.files.some(file =>
        file.title.toLowerCase().includes(text) ||
        file.filename.toLowerCase().includes(text)
    )) {
        return true;
    }

    // सभी Subfolders
    for (const [name, sub] of Object.entries(folder.folders)) {

        // Subfolder Name
        if (name.toLowerCase().includes(text)) {
            return true;
        }

        // Recursive Search
        if (folderContainsText(sub, text)) {
            return true;
        }
    }

    return false;

}

function updateKeyboardSelection(){

    visibleFolders.forEach(f=>{

        f.item.style.background="";
        f.item.style.color="";

    });

    const current = visibleFolders[keyboardIndex];

    console.clear();

console.log("keyboardIndex =", keyboardIndex);

console.log("visibleFolders length =", visibleFolders.length);

console.table(
    visibleFolders.map((f, i) => ({
        Index: i,
        Key: f.key,
        Path: f.folderPath.join(" > ")
    }))
);

    if(!current) return;

    selectedFolder = current.item;
    showFolderFiles(current.folder, current.folderPath.join(" > "));

    current.item.style.background="#2563eb";
    current.item.style.color="#ffffff";

    current.item.scrollIntoView({
        block:"nearest"
    });

    console.log(
    "Selected:",
    current.key,
    current.item.innerText
);

}

function searchFiles() {

    const text = document
        .getElementById("fileSearchInput")
        .value
        .trim()
        .toLowerCase();

    if (text === "") {

    if (currentFolder) {

        showFolderFiles(currentFolder, currentFolderName);

    } else {

        contentArea.innerHTML = `
            <div class="contentHeader">
                <h2>🙏 Welcome</h2>
                <p>📚 Jyotish Study Library</p>
                <p>Type to search files...</p>
            </div>
        `;

    }

    return;

}

    const results = library.filter(item => {

    const searchText = [

        item.title,

        item.filename,

        item.language,

        item.author || "",

        ...(item.path || []),

        ...(item.keywords || []),

        ...(item.related || [])

    ]

    .join(" ")

    .toLowerCase();

    return searchText.includes(text);

});

    showSearchResults(results);

}

function showSearchResults(results) {

    contentArea.innerHTML = `

<div class="contentHeader">

<h2>🔍 Search Results</h2>

<p>📚 Results Found : ${results.length}</p>

<hr>

</div>

`;

    results.forEach(item => {

        contentArea.appendChild(

    createFileCard(item)

);

    });

}

document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key === "f"){

        e.preventDefault();

        fileSearchInput.focus();

        fileSearchInput.select();

    }

});

document.addEventListener("keydown", function(e){

    if(e.key !== "Escape") return;

        // ---------- File Viewer ----------
    const viewer = document.getElementById("viewerArea");

    if(viewer.style.display === "block"){

        viewer.style.display = "none";

        document.getElementById("fileViewer").src = "";

        document.getElementById("contentArea").style.display = "block";

        return;

    }

    // ---------- Left Search ----------
    categorySearchInput.value = "";
    filterTree();

    // ---------- Right Search ----------
    fileSearchInput.value = "";
    currentFolder = null;
    currentFolderName = "";
    searchFiles();

    // ---------- Collapse Tree ----------
    allChildContainers.forEach(c=>{
        c.style.display="none";
    });

    allFolderItems.forEach(f=>{

        f.item.innerHTML="▶ "+f.icon+" "+f.key;

        f.item.style.background="";
        f.item.style.color="";

    });

    selectedFolder=null;

    // Focus back to Left Search
    categorySearchInput.focus();

});

document.addEventListener("keydown", function(e){

    // केवल Left Search Box पर ही काम करे

    // console.log(
    // "ACTIVE ELEMENT =",
    // document.activeElement
    // );

    if(document.activeElement !== categorySearchInput) return;

    // Search Result नहीं है
    if(visibleFolders.length === 0) return;

    // -----------------------
    // Arrow Down
    // -----------------------
    if(e.key === "ArrowDown"){

        e.preventDefault();

        keyboardIndex++;
        // console.log("DOWN =>", keyboardIndex);

        if(keyboardIndex >= visibleFolders.length){
            keyboardIndex = 0;
        }

        updateKeyboardSelection();
        return;
    }

    // -----------------------
    // Arrow Up
    // -----------------------
    if(e.key === "ArrowUp"){

        e.preventDefault();

        keyboardIndex--;
        // console.log("UP =>", keyboardIndex);

        if(keyboardIndex < 0){
            keyboardIndex = visibleFolders.length - 1;
        }

        updateKeyboardSelection();
        return;
    }

    // -----------------------
    // Enter
    // -----------------------
    if(e.key === "Enter"){

        e.preventDefault();

    const current = visibleFolders[keyboardIndex];

    //     console.log({
    //     index: keyboardIndex,
    //     key: current.key,
    //     display: current.item.style.display,
    //     text: current.item.innerText
    // });

        if(!current) return;

        // Mouse Click जैसा व्यवहार
        
        current.item.onclick();

        return;
    }

});