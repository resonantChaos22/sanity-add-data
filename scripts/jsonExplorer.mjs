import beegJson from "./beegjson.json" with { type: "json" };

const Run = async () => {
    for (const data of beegJson.result) {
        console.log(data);
    }
}

Run();