import SanityClient from "./sanity-client.mjs";
import * as utils from "./utils.mjs";
import dotenv from "dotenv";
dotenv.config();

/**
 * @typedef {import('@sanity/client').SanityClient} SanityClient
 */

const Run = async () => {
  try {
    const sanityProjectId = process.env.SANITY_PROJECT_ID;
    const sanityDataset = process.env.SANITY_DATASET;
    const sanityApiVersion = process.env.SANITY_API_VERSION;
    const sanityToken = process.env.SANITY_TOKEN;
    const sanityClient = new SanityClient(
      sanityProjectId,
      sanityToken,
      sanityDataset,
      false,
      sanityApiVersion
    );

    let data = await utils.ProcessCSV("persons.csv");
    console.log(data);

    await getAllData(sanityClient);
    await flowOne(sanityClient);
  } catch (err) {
    console.log(err);
    console.log("Final Cutoff");
  }
};

/**
 * Runs the flow of adding one person and then deleting it.
 *
 * @param {SanityClient} sanityClient - The sanity client instance.
 */
const flowOne = async (sanityClient) => {
  let persons = await sanityClient.GetAllPersons();
  console.log(persons.length);
  let result = await sanityClient.AddPerson(
    "Brad Pitt",
    "brad-pitt.jpg",
    "brad-pitt"
  );

  persons = await sanityClient.GetAllPersons();
  console.log(persons.length);

  let deleteResult = await sanityClient.DeletePerson(result._id);
  console.log(deleteResult);

  persons = await sanityClient.GetAllPersons();
  console.log(persons.length);
};

/**
 * Fetches all relevant data from Sanity.
 *
 * @param {SanityClient} sanityClient - The sanity client instance.
 */
const getAllData = async (sanityClient) => {
  await sanityClient.GetAllAssets();
  await sanityClient.GetAllDocumentsOfType("movie");
  await sanityClient.GetAllDocumentsOfType("screening");
  await sanityClient.GetAllPersons();
};

Run();
