import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
// socket.io in back-end
const socketIO = SocketIO(server);

function publicRooms() {
    const {
      sockets: {
        adapter: { sids, rooms },
      },
    } = socketIO;
    const publicRooms = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });
    return publicRooms;
  }

socketIO.on("connection", socket => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    socket.on("enter_room", (userName, roomName, done) => {
        socket["nickname"] = userName ? userName : "Anon";
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
        socketIO.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("bye", socket.nickname);
        });
    });

    socket.on("disconnect", () => {
        socketIO.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })

    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname;
    })

})

server.listen(3000, handleListen);
