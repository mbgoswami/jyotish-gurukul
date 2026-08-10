const express = require("express");
const open = require("open").default;
const path = require("path");

const app = express();

const ROOT = path.join(__dirname, "..");

app.use(express.static(ROOT));

const PORT = 3000;

app.listen(PORT, async () => {

    console.log("");
    console.log("====================================");
    console.log("   Jyotish Study Library Started");
    console.log("====================================");
    console.log("");

    console.log("Serving Folder :");
    console.log(ROOT);

    console.log("");

    console.log("Opening Browser...");

    await open("http://localhost:" + PORT);

});