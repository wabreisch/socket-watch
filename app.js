// Requires
const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);

// App variables
const PORT = 3000;
const connections = [];
const directoryToWatch = "/";
const fsWatchOptions = { recursive: true };
let count = 0;

const fileUpdatedCallback = (eventType, fileName) => {
    io.emit("fsEvent", `${++count}: ${eventType} ${fileName}`);
}

// Set up our express server
app.use(express.static('public'))

// main logic
io.on("connection", socket => {
    connections.push(socket.id);
    if (connections.length === 1) {
        fs.watch(directoryToWatch, fsWatchOptions, fileUpdatedCallback);
    }

    socket.on("disconnect", disconnectMsg => {
        const indexToDelete = connections.indexOf(socket.id);
        connections.splice(indexToDelete, 1);

        // no point in watching the root directory if no one is listening...
        if (connections.length === 0) {
            fs.unwatchFile(directoryToWatch);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
