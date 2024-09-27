import SanityClient from "./sanity-client.mjs";

const Run = async () => {
  try {
    const sanityClient = new SanityClient(
      "eanv0g3s",
      "skd7qQrQk2gzsuNno5l5vIttOLs4LPLvxkoEDNA447jzulOPnfKVDkthMXd94DyQrXz3N1oeLWVc6x5w1xOJmdohBdLEbVzsuAWkOViTxJkQF2Qnz6KBnX0fAP8so6iZEDoo7M9HLmiCM1NNoRBfdKL0JBHTjEAtnzxBZvWx1VeSbAUserpX",
      "production",
      false,
      "2024-01-24"
    );

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

    person = await sanityClient.GetAllPersons();
    console.log(persons.length);
  } catch (err) {
    console.log(err);
    console.log("Final Cutoff");
  }
};

Run();
