import Transaction from "@/models/transaction";
const createTransactionRecord = (
  input: Partial<Transaction>
): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    Transaction.create(input)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
export default createTransactionRecord;

export const findOneTranscationRecord = (
  input: Partial<Transaction>
): Promise<Transaction | null> => {
  return new Promise((resolve, reject) => {
    Transaction.findOne({ where: input })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};
