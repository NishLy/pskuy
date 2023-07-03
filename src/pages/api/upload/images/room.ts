import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next/types";
import { ROOM_BASE_PATH } from "@/static/path";
import generateRandomString from "@/lib/generateRandString";
import { saveFile } from "@/lib/files";
import Room from "@/models/room";

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
    if (err) return res.status(500).json({ err });
    if (!files) return res.status(500).json({ err });
    return saveMultipleFile(files, { id: fields.id as string })
      .then(async (result) => {
        console.log(fields);
        const updateResult = await Room.update(
          { room_images: result.images.toString() },
          { where: { id: parseInt(fields.id as string) } }
        ).catch((err) => {
          throw res.status(500).json({ err });
        });
        console.log(updateResult);
        return updateResult[0] !== 0
          ? res.status(200).end()
          : res.status(500).json({ result });
      })
      .catch(() => res.status(500).end());
  });
}

export const saveMultipleFile = async (
  arr: object,
  prop: { id: string }
): Promise<{ logo: string; images: string[] }> => {
  return new Promise((resolve, reject) => {
    const arrPath: string[] = [];
    const objectLength = Object.keys(arr).length;
    let index = 0;
    for (const file in arr) {
      saveFile(
        {
          basePath: ROOM_BASE_PATH + prop.id + "/",
          fileName: generateRandomString(),
        },
        arr[file as keyof typeof arr]
      )
        .then((_res) => {
          arrPath.push(_res);
          if (index + 1 == objectLength)
            return resolve({ images: arrPath, logo: "" });
          index++;
        })
        .catch((err) => reject(err));
    }
  });
};
