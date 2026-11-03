import fs from "fs";
import path from "path";

const unlinkFile = (file: string) => {
  const url = new URL(file);
  const onlyPath = url.pathname;

  const filePath = path.join("uploads", onlyPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default unlinkFile;
