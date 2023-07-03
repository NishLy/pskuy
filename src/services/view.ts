import optsQuery from "@/interfaces/query";
import View from "@/models/view";

export const findOneViewRecord = (
  input: Partial<View>,
  opts?: optsQuery
): Promise<View | null> => {
  return new Promise((resolve, reject) => {
    View.findOne({ where: input })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
