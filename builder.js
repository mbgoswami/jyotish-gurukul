const fs = require("fs");
const path = require("path");

let oldLibrary = [];

if (fs.existsSync("library.json")) {

    try {

        oldLibrary = JSON.parse(

            fs.readFileSync("library.json", "utf8")

        );

        console.log("Existing library loaded :", oldLibrary.length);

    } catch {

        console.log("Existing library not readable.");

    }

}

const ROOT = path.join(__dirname, "PDF");

let library = [];

let id = 1;

let totalFolders = 0;
let totalFiles = 0;
let newFiles = 0;
let updatedFiles = 0;

console.log("Scanning Folder...");
console.log(ROOT);

scan(ROOT);

function scan(folder){

    const items = fs.readdirSync(folder);

    items.forEach(item=>{

        const fullPath = path.join(folder,item);

        const stat = fs.statSync(fullPath);

        if(stat.isDirectory()){

            totalFolders++;

            console.log("📂",fullPath);

            scan(fullPath);

        }else{
            totalFiles++;
            console.log("📄", item);

const relative = path.relative(ROOT, fullPath);

const parts = relative.split(path.sep);

const old = oldLibrary.find(

    x => x.filepath ===

    "PDF/" + relative.replaceAll("\\","/")

);

if (old) {

    updatedFiles++;

} else {

    newFiles++;

}

library.push({

    id: id++,

    category: parts[0] || "",

    subcategory: parts[2] || "",

    path: parts.slice(0, parts.length - 1),

    title: path.parse(item).name,

    filename: item,

    filepath: "PDF/" + relative.replaceAll("\\","/"),

    language: old?.language || "",

    pages: old?.pages || 0,

    keywords: old?.keywords || [],

    related: old?.related || [],
});

        }

    });

}

fs.writeFileSync(

    "library.json",

    JSON.stringify(library, null, 4),

    "utf8"

);

console.log("--------------------------------");

console.log("Total Files :", library.length);

console.log("library.json created successfully.");

console.log("--------------------------------");