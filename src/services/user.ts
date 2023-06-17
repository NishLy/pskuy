import USER_DATA, { USER } from "@/interfaces/user";
import User from "@/models/user";
import { hashString } from "@/utils/crypto";

export default function registerUser({
  email,
  number,
  password,
  username,
}: USER): Promise<USER_DATA> {
  return new Promise((resolve, reject) => {
    hashString(password)
      .then((hashedString) => {
        User.create({ username, email, number, password: hashedString })
          .then((user) => resolve(user))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

export const findOneUserRecord = (
  input: Partial<USER_DATA>
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    User.findOne({ where: input })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
