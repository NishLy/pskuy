import OFFER_DATA from "@/interfaces/offer";
import Offer from "@/models/offer";

/**
 * This function finds all offer records that match the input criteria and returns them as a Promise.
 * @param input - Partial<OFFER_DATA>, which means that the input parameter is an object that contains
 * some or all of the properties of the OFFER_DATA interface. This object is used to filter the results
 * of the Offer.findAll() method.
 * @returns The function `findAllOfferRecords` is returning a Promise that resolves to an array of
 * `Offer` objects. The `Offer` objects are retrieved from the database using the `findAll` method of
 * the `Offer` model, with the `where` clause being specified by the `input` parameter. If the
 * retrieval is successful, the Promise resolves with the array of `Offer` objects. If there
 */
export const findAllOfferRecords = (
  input: Partial<OFFER_DATA>
): Promise<Offer[]> => {
  return new Promise((resolve, reject) => {
    Offer.findAll({ where: input })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};
