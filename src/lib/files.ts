import fs from "fs";
import path from "path";

export function saveFile(
  { basePath, fileName }: { basePath: string; fileName: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function deleteFile(path: string) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
}

export function readDir(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
}
