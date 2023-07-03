import NotFoundError from "@/error/notFound";
import UnauthorizedError from "@/error/unauthorized";
import Owner from "@/models/owner";
import User from "@/models/user";
import { comparePassword } from "@/utils/crypto";

export default function loginUser(
  username: string,
  password: string
): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    User.findOne({ where: { username: username } })
      .then(async (result) => {
        if (!result)
          return reject(
            new NotFoundError("User tidak ditemukan", {
              cause: `${username} are not exists`,
            })
          );
        return comparePassword(password, result.password)
          .then((res) =>
            res
              ? resolve(result)
              : reject(
                  new UnauthorizedError("Password tidak benar!", {
                    cause: `${password} mistmacth`,
                  })
                )
          )
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

export function loginOwner(
  username: string,
  password: string
): Promise<Owner | undefined> {
  return new Promise((resolve, reject) => {
    Owner.findOne({ where: { username: username } })
      .then(async (result) => {
        if (!result)
          return reject(
            new NotFoundError("Owner tidak ditemukan!", {
              cause: `${username} are not exists`,
            })
          );
        return comparePassword(password, result.password)
          .then((res) =>
            res
              ? resolve(result)
              : reject(
                  new UnauthorizedError("Password tidak benar!", {
                    cause: `${password} mistmacth`,
                  })
                )
          )
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}
