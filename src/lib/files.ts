import fs from "fs";
import path from "path";
import { generateRStringDate } from "./generateRandString";

export function saveFile(
  { basePath, fileName }: { basePath: string; fileName: string },
  file: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const newPath = basePath + fileName + path.extname(file.originalFilename);
    fs.mkdir(basePath, { recursive: true }, (err) => {
      if (err) reject(err);
      fs.cp(file.filepath, newPath, (err) => {
        if (err) reject(err);
        fs.unlink(file.filepath, (err) => {
          if (err) reject(err);
          resolve(newPath.replace("./public", ""));
        });
      });
    });
  });
}
