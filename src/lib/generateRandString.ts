import crypto from "node:crypto";
export default function generateRandomString(length = 20) {
  return crypto.randomBytes(length).toString("hex");
}

export function generateRStringDate(): string {
  return new Date().toDateString() + "-" + generateRandomString();
}
