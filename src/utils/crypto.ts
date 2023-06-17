import bcrypt from "bcrypt";

export function comparePassword(
  inputPass: string,
  dataPass: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(inputPass, dataPass)
      .then((match) => resolve(match))
      .catch((err) => reject(err));
  });
}

export function hashString(str: string): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(str, 10)
      .then((hashed) => resolve(hashed))
      .catch((err) => reject(err));
  });
}
