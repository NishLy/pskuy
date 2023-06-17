import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next/types";
import { RENTAL_LOGO_PATH, ROOM_BASE_PATH } from "@/static/path";
import generateRandomString, {
  generateRStringDate,
} from "@/lib/generateRandString";
import { saveFile } from "@/lib/files";
import Rental from "@/models/rental";
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
    if (err) return res.status(500).end({ err });
    if (!files.image) return res.status(500).end({ err });
    saveFile(
      {
        basePath: ROOM_BASE_PATH + fields.id + "/",
        fileName: generateRandomString(),
      },
      files.image
    )
      .then((path) => {
        Room.update({ images_directory: path }, { where: { id: fields.id } })
          .then(() => res.status(200).end())
          .catch((err) => res.status(500).end(err));
      })
      .catch((err) => res.status(500).end(err));

    return res.status(200).end();
  });
}
