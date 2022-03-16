const express = require("express");
const app = express();
const path = require("path");
const cn = require("./mongo/connection");

// Set Bootstrap CSS path
app.use("/css", express.static("./node_modules/bootstrap/dist/css"));

// Set JS Bootstrap path
app.use("/js", express.static("./node_modules/bootstrap/dist/js"));

// Set the path of files for JS scripts
app.use("/files", express.static(path.join(__dirname, "files")));

// Join express.js with persona.html
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "pages/library.html"));
});

// Set a listening port
app.listen("9000", (e) => {
    console.log("[INFO] Server loaded successfully");
});

app.get("/books", (request, response) => {
    cn.getAll(request, response);
});