const pg = require("pg");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const fileName = "../actualData-Reviews-workingEdition.json";

const myJson = fs.readFileSync(path.join(__dirname, fileName));

// console.log("parse", JSON.parse(myJson));
// for (let rev of myJson) {
//   console.log("rev", rev);
// }

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "airbnb",
  user: "postgres",
  password: "datasaver",
});

client
  .connect()
  .then(async () => {
    console.log("were connected");
    let parsed = JSON.parse(myJson);
    let counter = 0;
    for (let item of parsed) {
      try {
        counter++;
        await client.query(
          `insert into bnb_reviews (name, loc_id, gender, profilePicNum, date, sentence, accuracy_rating, communication_rating, cleanliness_rating, location_rating, check_in_rating, value_rating, overall_rating) VALUES ('${item.name}', ${item.loc_id}, '${item.gender}', ${item.profilePicNum}, '${item.date}', '${item.sentence}', ${item.accuracy_rating}, ${item.communication_rating}, ${item.cleanliness_rating}, ${item.location_rating}, ${item.check_in_rating}, ${item.value_rating}, ${item.overall_rating})`
        );
      } catch (err) {
        console.log("counter", counter, "err", err);
      }
    }
    client.end((err) => {
      console.log("client has disconnected");
      if (err) {
        console.log("error during disconnection", err.stack);
      }
    });
  })
  .catch((err) => console.error("connection error", err.stack));
