import { Meteor } from "meteor/meteor";
import "../imports/api/UsersApi";
import { UsersCollection } from "../imports/api/UsersApi";
import { Accounts } from "meteor/accounts-base";

Meteor.startup(async () => {
  const defaultAdmin = UsersCollection.findOne({ username: "mando" });
  console.log(defaultAdmin);
  if (!defaultAdmin) {
    Accounts.createUser({
      username: "mando",
      email: "oke.jo26@gmail.com",
      password: "Test-123*",
    });
  }
});
