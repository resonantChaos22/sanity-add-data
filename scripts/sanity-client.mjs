import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class SanityClient {
  client;

  constructor(projectId, token, dataset, useCdn, apiVersion) {
    this.client = createClient({
      projectId: projectId,
      token: token,
      dataset: dataset,
      useCdn: useCdn,
      apiVersion: apiVersion,
    });
  }

  async GetAllPersons() {
    try {
      const persons = await this.client.fetch(`*[_type=='person']`);
      fs.writeFileSync(
        "persons.json",
        JSON.stringify(persons, null, 2),
        "utf-8"
      );
      return persons;
    } catch (err) {
      console.error("Error fetching persons:", err);
      throw err;
    }
  }

  async GetAllAssets() {
    try {
      const query = `
        {
          "images": *[_type == "sanity.imageAsset"],
          "files": *[_type == "sanity.fileAsset"]
        }
      `;
      const assets = await this.client.fetch(query);
      fs.writeFileSync("assets.json", JSON.stringify(assets, null, 2), "utf-8");

      return assets;
    } catch (err) {
      console.error("Error fetching assets:", err);
      throw err;
    }
  }

  async GetDocument(documentID) {
    try {
      const document = await this.client.getDocument(documentID);
      if (!document) {
        console.error("Document not found:", documentID);
        return;
      }
      return document;
    } catch (err) {
      console.error("Error getting document: ", err);
      throw err;
    }
  }

  async UploadImage(imageFileName) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const imagePath = path.join(__dirname, "images", imageFileName);

      const imageFile = fs.readFileSync(imagePath);

      const uploadResult = await this.client.assets.upload("image", imageFile, {
        filename: imageFileName,
      });

      console.log("Image uploaded successfully:", uploadResult);
      return uploadResult;
    } catch (err) {
      console.error("Error uploading image:", err);
      throw err;
    }
  }

  async AddPerson(name, imageFileName, slug) {
    try {
      const uploadResult = await this.UploadImage(imageFileName);

      const newPerson = {
        _type: "person",
        name: name,
        image: {
          _type: "image",
          asset: {
            _ref: uploadResult._id,
            _type: "reference",
          },
        },
        slug: {
          _type: "slug",
          current: slug,
          source: "name",
        },
      };

      const createResult = await this.client.create(newPerson);
      console.log("Person created successfully:", createResult);
      return createResult;
    } catch (err) {
      console.error("Error adding person:", err);
      throw err;
    }
  }

  async DeleteDocument(documentId) {
    try {
      const deleteResult = await this.client.delete(documentId);
      console.log("Document deleted successfully:", deleteResult);
      return deleteResult;
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  }

  async DeleteImage(imageId) {
    try {
      const references = await this.client.fetch(
        `*[_type == "person" && image.asset._ref == $imageId]`,
        {
          imageId,
        }
      );

      if (references.length > 0) {
        for (const ref of references) {
          await this.client.patch(ref._id).unset(["image"]).commit();
          console.log(`Removed reference from person: ${ref._id}`);
        }
      }
      let deleteResult = await this.DeleteDocument(imageId);
      console.log("Image deleted successfully:", imageId);
      return deleteResult;
    } catch (err) {
      console.error("Error deleting image:", err);
      throw err;
    }
  }

  async DeletePerson(personId) {
    try {
      const person = await this.GetDocument(personId);

      const imageAssetId = person.image?.asset?._ref;
      if (imageAssetId) {
        await this.DeleteImage(imageAssetId);
        console.log("Image deleted successfully:", imageAssetId);
      }

      const deleteResult = await this.DeleteDocument(personId);
      console.log("Person deleted successfully:", deleteResult);

      return deleteResult;
    } catch (err) {
      console.error("Error deleting person and image:", err);
      throw err;
    }
  }
}

export default SanityClient;
