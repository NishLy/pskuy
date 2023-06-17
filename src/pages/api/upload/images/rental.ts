import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next/types";
import { RENTAL_IMAGES_PATH, RENTAL_LOGO_PATH } from "@/static/path";
import generateRandomString, {
  generateRStringDate,
} from "@/lib/generateRandString";
import { saveFile } from "@/lib/files";
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

  form.parse(request, function async(err, fields, files) {
    if (err) return res.status(500).end({ err });
    if (!files) return res.status(500).end({ err });

    saveMultipleFile(files, { id: fields.id as string })
      .then((result) => {
        Rental.update(
          { rental_logo: result.logo, rental_images: result.images.toString() },
          { where: { id: fields.id } }
        )
          .then((result) => {
            result[0] !== 0
              ? res.status(200).end()
              : res.status(500).end({ result });
          })
          .catch((err) => res.status(500).end());
      })
      .catch((err) => res.status(500).end());
  });
}

export const saveMultipleFile = async (
  arr: object,
  prop: { id: string }
): Promise<{ logo: string; images: string[] }> => {
  return new Promise((resolve, reject) => {
    const arrPath: string[] = [];
    let pathLogo = "";
    const objectLength = Object.keys(arr).length;
    let index = 0;
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
          index++;
          file === "logo_image" ? (pathLogo = res) : arrPath.push(res);
          if (index + 1 >= objectLength)
            return resolve({ images: arrPath, logo: pathLogo });
        })
        .catch((err) => reject(err));
    }
  });
};
