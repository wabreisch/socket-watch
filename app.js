// Requires
const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);

// App variables
const PORT = 3000;
let count = 0;

// Set up our express server
app.use(express.static('public'))

// main logic
io.on("connection", function (socket) {
    fs.watch("/", { recursive: true }, (eventType, fileName) => {
        count += 1;
        io.emit("fsEvent", `${count}: ${eventType} ${fileName}`);
    });

    socket.on("disconnect", socket => {
        fs.unwatchFile("/");
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});