const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const { addAdmin, addEvent, addTicket, useTicket, useEvent } = require("./bd");
const { default: mongoose } = require("mongoose");

const limit = 52428800;
let text = "oleg";

const app = express();

app.use(
  cors({
    allowedHeaders:
      "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
    origin: "http://localhost:8080",
  })
);
app.use(parser.urlencoded({ extended: false, limit: limit }));
app.use(parser.json({ limit: limit }));

app.get("/", function (req, res) {
  console.log("qweqweqweq");
  res.send(text);
});

app.post("/create-admin", function (req, res) {
  addAdmin(req, res);
});

app.post("/create-event", function (req, res) {
  addEvent(req, res);
});

app.post("/create-ticket", function (req, res) {
  addTicket(req, res);
});

app.post("/use-ticket", function (req, res) {
  useTicket(req, res);
});

app.get("/use-event", function (req, res) {
  useEvent(req, res);
});

const bdconect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://olegbr:Ferari150@cluster0.gmbmlyd.mongodb.net/test"
    );
    console.log("successfuly conected to Mongo");
  } catch (error) {
    console.log(error);
  }
};
app.listen(3005, () => {
  bdconect();
});
