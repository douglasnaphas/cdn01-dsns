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

describe("Tests defvars paths", () => {
  describe("ok paths", () => {
    it("verifies /defvar-ok-1", (done) => {
      request
        .get("/defvar-ok-1")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`var1 = "val1"; console.log("var1 set to val1");`);
          done(err);
        });
    });
    it("verifies /defvar-ok-1?var=abc", (done) => {
      request
        .get("/defvar-ok-1?var=abc")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`abc = "val1"; console.log("abc set to val1");`);
          done(err);
        });
    });
    it("verifies /defvar-ok-1?var=abc&val=xyz", (done) => {
      request
        .get("/defvar-ok-1?var=abc&val=xyz")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`abc = "xyz"; console.log("abc set to xyz");`);
          done(err);
        });
    });
    it("verifies /defvar-ok-2", (done) => {
      request
        .get("/defvar-ok-2")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`var2 = "val2"; console.log("var2 set to val2");`);
          done(err);
        });
    });
    it("verifies /defvar-ok-2?val=twoval", (done) => {
      request
        .get("/defvar-ok-2?val=twoval")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`var2 = "twoval"; console.log("var2 set to twoval");`);
          done(err);
        });
    });
    it("verifies /defvar-ok-2?val=twotwo&var=too", (done) => {
      request
        .get("/defvar-ok-1?val=twotwo&var=too")
        .expect(200)
        .end((err, result) => {
          test
            .string(result.text)
            .contains(`too = "twotwo"; console.log("too set to twotwo");`);
          done(err);
        });
    });
  });
  describe("bad paths", () => {
    it("verifies /defvar-bad-1 gives 400", (done) => {
      request
        .get("/defvar-bad-1")
        .expect(400)
        .end((err, result) => {
          done(err);
        });
    });
    it("verifies /defvar-bad-2 gives 500", (done) => {
      request
        .get("/defvar-bad-2")
        .expect(500)
        .end((err, result) => {
          done(err);
        });
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
