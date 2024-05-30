import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    sockets.push(socket);
    socket["nickname"] = "Anon";
    
    socket.on("close", onSocketClose);

    socket.on("message", msg => {
        const message = JSON.parse(msg);
        console.log(message);
        switch (message.type) {
            case "new_message":
                sockets.forEach((sk) => {
                    sk.send(`${socket.nickname}: ${message.payload}`)
                });
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    })
});

function onSocketClose() {
    console.log("Disconnected from th Browser");
}

server.listen(3000, handleListen);
