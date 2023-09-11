/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("meteor");

// Create a new document in the collection.
db.getCollection("recruitment").insertOne({
  _id: "NcoZ8YDmSSHZzXazY",
  age: 18,
  amountOfHours: 124,
  experience: "Very much exp",
  referred: true,
  attendenceBehaviour: "No problem, i will be there",
  preferredName: "Marc Maggus",
  discordId: "UMI#8938",
  steamProfile: "https://fake-steam-url.com",
  referrer: "v8dhGJYLZgRHkPx9K",
  status: "open",
});
