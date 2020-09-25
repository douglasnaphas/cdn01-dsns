var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");

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
  if (req.query && req.query.jsonp == "parseResponse") {
    res.set({ "Content-Type": "application/javascript" });
    return res.send('parseResponse({"number":3})');
  }
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

app.get("/defvar-ok-1", (req, res) => {
  const varName = (req.query && req.query.var) || "var1";
  const varVal = (req.query && req.query.val) || "val1";
  res.set({ "Content-Type": "application/javascript" });
  return res.send(
    `${varName} = "${varVal}"; console.log("${varName} set to ${varVal}");`
  );
});

app.get("/defvar-ok-2", (req, res) => {
  const varName = (req.query && req.query.var) || "var2";
  const varVal = (req.query && req.query.val) || "val2";
  res.set({ "Content-Type": "application/javascript" });
  return res.send(
    `${varName} = "${varVal}"; console.log("${varName} set to ${varVal}");`
  );
});

app.get("/defvar-bad-1", (req, res) => {
  return res.status(400).send("client error for /defvar-bad-1");
});

app.get("/defvar-bad-2", (req, res) => {
  return res.status(500).send("client error for /defvar-bad-2");
});

app.get("/html-1", (req, res) => {
  const contents = fs.readFileSync(`public${path.sep}page-01.html`);
  res.set({ "Content-Type": "text/html" });
  return res.send(contents.toString());
});

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
