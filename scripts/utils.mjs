import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

const ProcessCSV = async (fileName) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const csvPath = path.join(__dirname, "static", fileName);

    const data = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
    return data;
  } catch (err) {
    console.error("Error in processing CSV: ", err);
    throw err;
  }
};

const GetImageFile = async (fileName) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imagePath = path.join(__dirname, "images", fileName);

    const imageFile = fs.readFileSync(imagePath);
    return imageFile;
  } catch (err) {
    console.error("Error in getting image file: ", err);
    throw err;
  }
};

const WriteIntoJSONFile = async (fileName, data, folderName = "output") => {
  try {
    fs.writeFileSync(
      `${folderName}/${fileName}`,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Error writing into json: ", err);
    throw err;
  }
};

export { ProcessCSV, GetImageFile, WriteIntoJSONFile };
