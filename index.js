const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const http = require("http");

const userRoute = require("./routes/userRoute");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello pokemon");
});

const PORT = process.env.PORT || 5000;
mongoose.connect(
  "mongodb://localhost:27017/my-pokedex",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected database")
);

app.use("/user", userRoute);

const server = http.createServer(app);
const io = socketIO(server);
app.set('socketio', io);

let interval;

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});



server.listen(PORT, () => console.log("Server started!"));
