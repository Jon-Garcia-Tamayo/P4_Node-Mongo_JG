const express = require("express");
const app = express();

app.use("/css", express.static("./node_modules/bootstrap/dist/css"));

const path = require("path");

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "pages/library.html"));
});

app.listen("9000", (e) => {
    console.log("[INFO] Server loaded successfully");
})