import jwt from "jsonwebtoken";

export function signJWT(
  user: {
    uuid: string;
    username: string;
  },
  expiresIn: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      process.env.SECRET_TOKEN ?? "",
      { expiresIn },
      (err, encoded) => {
        if (err) return reject(err);
        return resolve(encoded ?? "");
      }
    );
  });
}

export function verifyJWT(token: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_TOKEN ?? "", (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
}
