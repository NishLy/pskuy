import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next/types";
import { RENTAL_IMAGES_PATH, RENTAL_LOGO_PATH } from "@/static/path";
import generateRandomString from "@/lib/generateRandString";
import { deleteFile, readDir, saveFile } from "@/lib/files";
import Rental from "@/models/rental";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") return POST(req, res);
  return res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextApiRequest, res: NextApiResponse) {
  const form = formidable({});

  form.parse(request, (err, fields, files) => {
    if (err) return res.status(500).end({ err });
    if (!files) return res.status(500).end({ err });

    return saveMultipleFile(files, { id: fields.id as string })
      .then(async (result) => {
        const rental = await Rental.findOne({ where: { id: fields.id } }).catch(
          (err) => res.status(500).end(err)
        );

        if (!rental) res.status(404).end();
        let updatedArr: string[] = [];

        if (fields.changed) {
          const imagesArr = (rental as Rental).rental_images?.split(",") ?? [];
          updatedArr = await deleteMultipleFiles(
            [...imagesArr, ...result.images],
            {
              baseImagesPath: RENTAL_IMAGES_PATH + fields.id + "/",
              baseLogoPath: result.logo
                ? "./public" + (rental as Rental).rental_logo
                : undefined,
            }
          ).catch((err) => {
            throw res.status(500).end(err);
          });
        }

        (rental as Rental).set({
          rental_logo: result.logo,
          rental_images: updatedArr.toString(),
        });

        (rental as Rental)
          .save()
          .then((result) => {
            res.status(200).json({ result });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => res.status(500).end(err));
  });
}

/**
 * This is a TypeScript function that saves multiple files and returns their paths, including a logo
 * image path, if provided.
 * @param {object} arr - an object containing files to be saved
 * @param prop - The `prop` parameter is an object that contains an `id` property, which is a string.
 * It is used to generate the file paths for saving the files.
 * @returns A Promise that resolves to an object with properties `logo` (optional string) and `images`
 * (array of strings).
 */
export const saveMultipleFile = async (
  arr: object,
  prop: { id: string }
): Promise<{ logo?: string; images: string[] }> => {
  return new Promise((resolve, reject) => {
    const arrPath: string[] = [];
    let pathLogo: string | undefined = undefined;
    const objectLength = Object.keys(arr).length;
    let index = 0;
    if (objectLength === 0) resolve({ images: [] });
    for (const file in arr) {
      saveFile(
        {
          basePath:
            file === "logo_image"
              ? RENTAL_LOGO_PATH + prop.id + "/"
              : RENTAL_IMAGES_PATH + prop.id + "/",
          fileName: generateRandomString(),
        },
        arr[file as keyof typeof arr]
      )
        .then((res) => {
          file === "logo_image" ? (pathLogo = res) : arrPath.push(res);
          if (index + 1 >= objectLength)
            return resolve({ images: arrPath, logo: pathLogo });
          index++;
        })
        .catch((err) => reject(err));
    }
  });
};

function deleteMultipleFiles(
  arr: string[],
  location: { baseImagesPath: string; baseLogoPath?: string }
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (location.baseLogoPath) deleteFile(location.baseLogoPath);
    readDir(location.baseImagesPath).then((existedFiles) => {
      for (let index = 0; index < existedFiles.length; index++) {
        if (
          !arr.includes(
            (location.baseImagesPath + existedFiles[index]).replace(
              /^\.\/public/,
              ""
            )
          )
        )
          deleteFile(location.baseImagesPath + existedFiles[index]).catch(
            (err) => reject(err)
          );
      }
      resolve(arr);
    });
  });
}
