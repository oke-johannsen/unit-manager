import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

export const UsersCollection = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish("users", function () {
    return UsersCollection.find();
  });

  Meteor.methods({
    "users.create": (username, password, email) => {
      Accounts.createUser({ username, email, password }, (err, res) => {
        if (!err) {
          return true;
        } else {
          console.error('Error in "Accounts.createUser":', err, res);
          return false;
        }
      });
    },
  });
}
