// Query DOM 
const messageContent = document.getElementById("message-content"),
      btn            = document.getElementById("btn-send"),
      lastMessage    = document.getElementById("last-message"),
      roomName       = document.getElementById("room-name");

// Make connection
const socket = io.connect();

// Emit events
btn.addEventListener("click", () => {
    socket.emit("chatMessage", {
        content: messageContent.value,
        roomName: roomName.innerHTML
    });
});

// Listen for events
socket.on("chatMessage", async (data) => {
    lastMessage.innerHTML += "<p><strong>" + data.handle + 
    ":&nbsp;</strong>" + data.content + "</p>";
});
