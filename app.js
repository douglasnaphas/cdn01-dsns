var express = require("express");
var app = express();

app.get("/", function (req, res) {
  res.set({ "Content-Type": "text/plain" });
  res.send("console.log('hi');");
});

app.post("/", function (req, res) {
  res.send({
    Output: "Hello World!",
  });
});

app.get("/json-1", (req, res) => {
  res.set({ "Content-Type": "application/json" });
  res.send({ number: 1 });
});

app.get("/json-2", (req, res) => {
  res.set({ "Content-Type": "application/json" });
  res.send({ number: 2 });
});

app.get("/json-3", (req, res) => {
  res.set({ "Content-Type": "application/json" });
  res.send({ number: 3 });
});

app.get(/[/]([0-9]+)/, function (req, res) {
  res.set({ "Content-Type": "text/plain" });
  res.send(`console.log('hi, from script ${req.params[0]}');`);
});

app.get("/json-js", (req, res) => {
  res.set({ "Content-Type": "application/javascript" });
  res.send({ message: "content type application/javascript", number: 42 });
});

app.get("/json-txt", (req, res) => {
  res.set({ "Content-Type": "text/plain" });
  res.send({ message: "content type text/plain", number: 43 });
});

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
