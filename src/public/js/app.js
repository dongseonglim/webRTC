const socket = io();

const roomlist = document.getElementById("roomlist");
const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const joinForm = welcome.querySelector("form");
room.hidden = true;

let roomTitle;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room: ${roomTitle}`;
    const nameForm = room.querySelector("#nickname");
    const msgForm = room.querySelector("#msg");
    nameForm.addEventListener("submit", handleNicknameSubmit);
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleJoinRoom(event) {
    event.preventDefault();
    const userName = joinForm.querySelector(".origin_name");
    const roomName = joinForm.querySelector(".room_name");
    socket.emit("enter_room", userName.value, roomName.value, showRoom);

    roomTitle = roomName.value;
    userName.value = "";
    roomName.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#nickname input");
    socket.emit("nickname", input.value);
    input.value = "";
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomTitle, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

joinForm.addEventListener("submit", handleJoinRoom);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left! bye~`);
});

socket.on("new_message", addMessage);

function makeRoomList(roomName){
    const div = document.createElement("div");
    const span = document.createElement("span");
    span.innerText = `Room. ${roomName}`;
    div.append(span);
    roomlist.append(div);
}

socket.on("room_change", (rooms) => {
    roomlist.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const div = document.createElement("form");
        const span = document.createElement("span");
        span.innerText = `Room. ${room}`;
        div.append(span);
        roomlist.append(div);
    })
})