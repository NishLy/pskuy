import { OWNER } from "@/interfaces/owner";
import Owner from "@/models/owner";
import { hashString } from "@/utils/crypto";

export const registerOwner = ({
  id_user,
  birth_date,
  email,
  name,
  nik,
  number,
  password,
  username,
}: OWNER): Promise<Owner> => {
  return new Promise<Owner>((resolve, reject) => {
    hashString(password)
      .then((password) => {
        Owner.create({
          id_user,
          birth_date,
          email,
          name,
          nik,
          number,
          password,
          username,
        })
          .then((owner) => resolve(owner))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

export const findOwnerRecord = (id: string): Promise<Owner | null> => {
  return new Promise((resolve, reject) => {
    Owner.findOne({ where: { id } })
      .then((owner) => resolve(owner))
      .catch((error) => reject(error));
  });
};
