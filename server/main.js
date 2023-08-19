import { Meteor } from "meteor/meteor";
import "../imports/api/UsersApi";
import "../imports/api/AttendenceApi";
import { UsersCollection } from "../imports/api/UsersApi";
import { Accounts } from "meteor/accounts-base";

Meteor.startup(async () => {
  const defaultAdmin = UsersCollection.findOne({ username: "mando" });
  if (!defaultAdmin) {
    Accounts.createUser({
      username: "mando",
      email: "oke.jo26@gmail.com",
      password: "Test-123*",
      profile: {
        points: 10,
        name: "Oke Johansen",
        rank: "Developer",
      },
    });
  }
});
