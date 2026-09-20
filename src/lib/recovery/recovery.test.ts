import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  emailError,
  emailFormatError,
  passwordError,
  normalizeAnswer,
  answerError,
  allowedProvidersLabel,
} from "./rules.ts";
import { hashAnswer, verifyAnswer } from "./answer-hash.ts";

describe("emailError (sign-up)", () => {
  it("accepts allowed providers, any case", () => {
    assert.equal(emailError("sunny@gmail.com"), null);
    assert.equal(emailError("  Sunny@Yahoo.COM "), null);
    assert.equal(emailError("a.b+c@outlook.com"), null);
    assert.equal(emailError("a@hotmail.com"), null);
  });
  it("rejects missing @, bad format and other providers", () => {
    assert.ok(emailError(""));
    assert.ok(emailError("sunny"));
    assert.ok(emailError("sunny@gmail"));
    assert.ok(emailError("sunny@@gmail.com"));
    assert.match(emailError("sunny@example.com") ?? "", /Gmail, Yahoo, Outlook or Hotmail/);
  });
  it("login only checks format", () => {
    assert.equal(emailFormatError("x@example.com"), null);
    assert.ok(emailFormatError("nope"));
  });
  it("lists providers nicely", () => {
    assert.equal(allowedProvidersLabel(), "Gmail, Yahoo, Outlook or Hotmail");
  });
});

describe("passwordError", () => {
  it("enforces 6 to 8 characters", () => {
    assert.ok(passwordError("12345"));
    assert.equal(passwordError("123456"), null);
    assert.equal(passwordError("12345678"), null);
    assert.ok(passwordError("123456789"));
  });
});

describe("answers", () => {
  it("normalizes case and spacing", () => {
    assert.equal(normalizeAnswer("  New   DELHI "), "new delhi");
    assert.ok(answerError("a"));
    assert.equal(answerError("Jorhat"), null);
  });
  it("hash verifies only matching answers, ignoring case/spacing", async () => {
    const h = await hashAnswer("Jorhat Assam");
    assert.notEqual(h, "jorhat assam");
    assert.equal(await verifyAnswer("  jorhat   ASSAM ", h), true);
    assert.equal(await verifyAnswer("Guwahati", h), false);
    assert.equal(await verifyAnswer("x", "garbage"), false);
  });
});
