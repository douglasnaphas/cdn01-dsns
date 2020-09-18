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

app.get("/:scriptNumber", function (req, res) {
  res.set({ "Content-Type": "text/plain" });
  res.send(`console.log('hi, from script ${req.params.scriptNumber}');`);
});

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
