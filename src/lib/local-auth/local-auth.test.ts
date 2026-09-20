import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

const la = await import("./local-auth.ts");

const acct = {
  name: "Saani",
  email: "Saani@Gmail.com",
  password: "8014618",
  questionId: "residence",
  answer: "Dimapur",
};

describe("on-device accounts", () => {
  beforeEach(() => store.clear());

  it("create account, then log in, then log out", async () => {
    assert.deepEqual(await la.localSignUp(acct), { ok: true });
    assert.equal(la.localEmailExists("saani@gmail.com"), true);
    assert.equal(la.readSessionEmail(), null, "sign-up must not log in");
    const r = await la.localSignIn("SAANI@gmail.com", "8014618");
    assert.deepEqual(r, { ok: true, name: "Saani" });
    assert.equal(la.readSessionEmail(), "saani@gmail.com");
    la.localSignOut();
    assert.equal(la.readSessionEmail(), null);
  });

  it("stores no plain text", async () => {
    await la.localSignUp(acct);
    const raw = [...store.values()].join("|");
    assert.ok(!raw.includes("8014618"));
    assert.ok(!raw.toLowerCase().includes("dimapur"));
  });

  it("unknown email and wrong password are told apart", async () => {
    await la.localSignUp(acct);
    assert.deepEqual(await la.localSignIn("nobody@gmail.com", "8014618"), {
      ok: false,
      reason: "no-account",
    });
    assert.deepEqual(await la.localSignIn("saani@gmail.com", "801461"), {
      ok: false,
      reason: "wrong-password",
    });
  });

  it("rejects bad email domain, short password, duplicate", async () => {
    assert.equal((await la.localSignUp({ ...acct, email: "a@example.com" })).ok, false);
    assert.equal((await la.localSignUp({ ...acct, password: "123" })).ok, false);
    await la.localSignUp(acct);
    assert.equal((await la.localSignUp(acct)).ok, false);
  });

  it("forgot password: right answer resets, wrong answer does not, lockout works", async () => {
    await la.localSignUp(acct);
    const base = { email: "saani@gmail.com", questionId: "residence", newPassword: "newpass1" };
    assert.equal((await la.localResetPassword({ ...base, answer: "Guwahati" })).ok, false);
    assert.equal((await la.localSignIn("saani@gmail.com", "newpass1")).ok, false);
    assert.equal((await la.localResetPassword({ ...base, questionId: "school", answer: "Dimapur" })).ok, false);
    assert.equal((await la.localResetPassword({ ...base, answer: "  dimapur " })).ok, true);
    assert.equal((await la.localSignIn("saani@gmail.com", "newpass1")).ok, true);
    assert.equal((await la.localSignIn("saani@gmail.com", "8014618")).ok, false);

    for (let i = 0; i < 5; i++) await la.localResetPassword({ ...base, answer: "wrong" });
    const locked = await la.localResetPassword({ ...base, answer: "dimapur" });
    assert.equal(locked.ok, false);
    assert.match((locked as { message: string }).message, /wait 15 minutes/);
  });
});
