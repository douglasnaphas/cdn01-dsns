"use strict";

const supertest = require("supertest");
const test = require("unit.js");
const app = require("../app.js");
const { text } = require("express");

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

describe("Tests JSON 1, 2, and 3", function () {
  const tests = [{ number: "1" }, { number: "2" }, { number: "3" }];
  tests.forEach(function (t) {
    it("verifies get on JSON source number " + t.number, function (done) {
      request
        .get(`/json-${t.number}`)
        .expect(200)
        .end(function (err, result) {
          test.number(result.body.number).is(parseInt(t.number));
          test
            .value(result)
            .hasHeader("content-type", "application/json; charset=utf-8");
          done(err);
        });
    });
  });
});

describe("Tests JSONP", function () {
  it("verifies JSONP at /json-3", (done) => {
    request
      .get("/json-3?jsonp=parseResponse")
      .expect(200)
      .end((err, result) => {
        test.string(result.text).contains('parseResponse({"number":3})');
        done(err);
      });
  });
});

describe("Test JSON with non-JSON content types", () => {
  it("verifies get json-js, JSON with content-type: application/javascript", (done) => {
    request
      .get("/json-js")
      .expect(200)
      .end(function (err, result) {
        const parsed = JSON.parse(result.text);
        const { message, number } = parsed;
        test.string(message).contains("content type application/javascript");
        test.number(number).is(42); // meaningless arbitrary number
        test
          .value(result)
          .hasHeader("content-type", "application/javascript; charset=utf-8");
        done(err);
      });
  });
  it("verifies get json-txt, JSON with content-type: text/plain", (done) => {
    request
      .get("/json-txt")
      .expect(200)
      .end(function (err, result) {
        const parsed = JSON.parse(result.text);
        const { message, number } = parsed;
        test.string(message).contains("content type text/plain");
        test.number(number).is(43); // meaningless arbitrary number
        test
          .value(result)
          .hasHeader("content-type", "text/plain; charset=utf-8");
        done(err);
      });
  });
});
