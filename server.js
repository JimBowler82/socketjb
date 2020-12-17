const express = require("express");
var cors = require("cors");
const app = express();

const port = 80;

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

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
