const socket = io();
const events = document.getElementById("events");

socket.on("fsEvent", event => {
    const newNode = document.createElement("li");
    const newTextNode = document.createTextNode(event);
    newNode.appendChild(newTextNode);
    events.appendChild(newNode)
});