const express = require("express");
var cors = require("cors");
const app = express();

const port = 80;

app.use(cors());

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let data = {
  score: 0,
  participants: 0,
};

// On new client connection
io.on("connection", (socket) => {
  io.emit("update", data);

  // On new vote
  socket.on("vote", (val) => {
    if (val) {
      data = {
        score: data.score + val,
        participants: (data.participants += 1),
      };
    }

    // Show the candidates in the console for testing
    console.log(data);

    // Tell everybody else about the new vote
    io.emit("update", data);
  });
});
