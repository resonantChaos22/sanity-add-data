import SanityClient from "./sanity-client.mjs";
import * as utils from "./utils.mjs";

/**
 * @typedef {import('@sanity/client').SanityClient} SanityClient
 */

const Run = async () => {
  try {
    const sanityClient = new SanityClient(
      "eanv0g3s",
      "skd7qQrQk2gzsuNno5l5vIttOLs4LPLvxkoEDNA447jzulOPnfKVDkthMXd94DyQrXz3N1oeLWVc6x5w1xOJmdohBdLEbVzsuAWkOViTxJkQF2Qnz6KBnX0fAP8so6iZEDoo7M9HLmiCM1NNoRBfdKL0JBHTjEAtnzxBZvWx1VeSbAUserpX",
      "production",
      false,
      "2024-01-24"
    );

    let data = await utils.ProcessCSV("persons.csv");
    console.log(data);
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
