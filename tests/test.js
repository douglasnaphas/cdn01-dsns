"use strict";

const supertest = require("supertest");
const test = require("unit.js");
const app = require("../app.js");

const request = supertest(app);

describe("Tests app", function () {
  it("verifies get", function (done) {
    request
      .get("/")
      .expect(200)
      .end(function (err, result) {
        test.string(result.text).contains("console.log('hi');");
        test
          .value(result)
          .hasHeader("content-type", "text/plain; charset=utf-8");
        done(err);
      });
  });
  it("verifies post", function (done) {
    request
      .post("/")
      .expect(200)
      .end(function (err, result) {
        test.string(result.body.Output).contains("Hello");
        test
          .value(result)
          .hasHeader("content-type", "application/json; charset=utf-8");
        done(err);
      });
  });
});

describe("Tests scripts 1, 2, and 3", function () {
  const tests = [{ path: "1" }, { path: "2" }, { path: "3" }];
  tests.forEach(function (t) {
    it("verifies get on script number " + t.path, function (done) {
      console.log(t.path + " running...");
      request
        .get("/" + t.path)
        .expect(200)
        .end(function (err, result) {
          test
            .string(result.text)
            .contains("console.log('hi, from script " + t.path + "');");
          test
            .value(result)
            .hasHeader("content-type", "text/plain; charset=utf-8");
          done(err);
        });
    });
  });
});
