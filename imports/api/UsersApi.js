import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

export const UsersCollection = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish("users", function () {
    return UsersCollection.find();
  });

  Meteor.methods({
    "users.create": (payload) => {
      const { username, password, email } = payload;
      const profile = {
        name: payload.name,
        tier: payload.tier,
        designation: payload.designation,
        rank: payload.rank,
        squad: payload.squad,
        squadPosition: payload.squadPosition,
        securityClearance: payload.securityClearance,
        points: payload.points,
        inactivityPoints: payload.inactivityPoints,
        status: "active",
      };
      Accounts.createUser({ username, email, password, profile });
    },
    "users.update": (payload) => {
      const user = Meteor.users.findOne(payload._id);
      const userId = user._id;
      if (user) {
        delete payload._id;
        console.log(payload);
        const modifier = {
          profile: {
            ...payload.profile,
          },
        };
        Meteor.users.update(userId, { $set: modifier });
      } else {
        return new Meteor.Error("Error 404", "user was not found", userId);
      }
    },
  });
}
