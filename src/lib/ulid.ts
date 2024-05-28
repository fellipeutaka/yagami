/**
 * Adapted from:
 * - https://github.com/ulid/javascript/blob/master/lib/index.ts
 */

// These values should NEVER change. If
// they do, we're no longer making ulids!
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
const ENCODING_LEN = ENCODING.length;
const TIME_LEN = 10;
const RANDOM_LEN = 16;

function generateRandomNumber() {
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  // biome-ignore lint:
  return buffer[0]! / 0xff;
}

function randomChar(): string {
  let rand = Math.floor(generateRandomNumber() * ENCODING_LEN);
  if (rand === ENCODING_LEN) {
    rand = ENCODING_LEN - 1;
  }
  return ENCODING.charAt(rand);
}

function encodeTime(now: number, len: number): string {
  let mod: number;
  let str = "";
  // biome-ignore lint:
  for (; len > 0; len--) {
    mod = now % ENCODING_LEN;
    str = ENCODING.charAt(mod) + str;
    // biome-ignore lint:
    now = (now - mod) / ENCODING_LEN;
  }
  return str;
}

function encodeRandom(len: number): string {
  let str = "";
  // biome-ignore lint:
  for (; len > 0; len--) {
    str = randomChar() + str;
  }
  return str;
}

export function ulid(): string {
  return encodeTime(Date.now(), TIME_LEN) + encodeRandom(RANDOM_LEN);
}
