import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { normalizeAnswer } from "./rules.ts";

/** Server-only: salted scrypt hashing for recovery answers (never stored in plain text). */

function derive(answer: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(normalizeAnswer(answer), salt, 32, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

/** Returns `saltHex:hashHex`. */
export async function hashAnswer(answer: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(answer, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyAnswer(answer: string, stored: string): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await derive(answer, Buffer.from(saltHex, "hex"));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
