import http from "http";
import { AndroidRemote, RemoteKeyCode, RemoteDirection } from "androidtv-remote";
import cors from "cors";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
var port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";

//const Server = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let deviceId;
let options = {
    pairing_port: 6467,
    remote_port: 6466,
    name: "androidtv-remote",
    cert: {},
};
// let androidRemote;

let users = [];

app.use(cors());

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html");
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    let androidRemote;
    socket.on("device id", (msg) => {
        // const user = {
        //     msg,
        //     id: socket.id,
        // };
        // socket.join(msg);
        // io.to(msg).emit("hi" + msg);

        // users.push(user);

        console.log("users :", users);

        io.emit("device id", msg);
        // var deviceId = req.query.deviceId;
        //var secretValue = req.query.secretValue;
        console.log("device iD :", msg);

        androidRemote = new AndroidRemote(msg, options);
        deviceId = msg;
        // androidRemote = new AndroidRemote(msg, options);

        console.log("android const :", androidRemote);

        if (deviceId) {
            androidRemote.start();
        }
    });

    socket.on("secret", (msg) => {
        io.emit("secret", msg);
        androidRemote.sendCode(msg);
        // androidRemote.on("secret", () => {
        //     console.log("on secret :", msg);
        //     // rl.question("Code : ", (code) => {
        //     androidRemote.sendCode(msg);

        //     // });
        //     // rl.close();
        // });
    });
    socket.on("key event", (msg) => {
        io.emit("key event", msg);

        console.log("REMOTE READY !!!!");
        // androidRemote.sendKey(RemoteKeyCode.MUTE, RemoteDirection.SHORT);
        // let cert = androidRemote.getCertificate();

        console.log("event :", msg);
        if (msg == "up") {
            androidRemote.sendKey(19, 3);
        }
        if (msg == "down") {
            androidRemote.sendKey(20, 3);
        }
        if (msg == "left") {
            androidRemote.sendKey(21, 3);
        }
        if (msg == "right") {
            androidRemote.sendKey(22, 3);
        }
        if (msg == "back") {
            androidRemote.sendKey(4, 3);
        }
        if (msg == "ok") {
            androidRemote.sendKey(66, 3);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(8080, () => {
    console.log(`listening on *:${port}`);
});
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// const server = http.createServer(function (req, res) {

//     /**
//      * Send Commands
//      */

// androidRemote.on("ready", async () => {
//     console.log("REMOTE READY !!!!");
//     // androidRemote.sendKey(RemoteKeyCode.MUTE, RemoteDirection.SHORT);
//     let cert = androidRemote.getCertificate();
//     setInterval(
//         () =>
//             rl.question("Key event  : ", (event) => {
//                 console.log("event :", event);
//                 if (event == "up") {
//                     androidRemote.sendKey(24, 3);
//                     // androidRemote.sendAppLink("https://www.youtube.com");
//                 }
//                 if (event == "down") {
//                     androidRemote.sendKey(25, 3);
//                 }
//             }),
//         10000
//     );
//     // rl.close();

//     //  androidRemote.sendKey(RemoteKeyCode.MUTE, RemoteDirection.SHORT)
// });
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Hello World!");
// });
// server.use();
// server.listen(8080, () => {
//     console.log("Server running on port 8080");
// });
