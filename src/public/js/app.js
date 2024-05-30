const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector(".chat");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server");
})

socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
});

socket.addEventListener("message", message => {
    console.log(message)
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
})

messageForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
})

nickForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
})