import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

export const UsersCollection = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish("users", function (filter = { "profile.status": "active" }) {
    return UsersCollection.find(filter);
  });

  Meteor.methods({
    "user.byId": (userId) => {
      return Meteor.users.findOne(userId);
    },
    "users.create": (payload) => {
      const { username, password } = payload;
      const profile = {
        ...payload?.profile,
        status: "active",
      };
      Meteor.call("logging.create", {
        key: "users.create",
        before: null,
        after: { username, profile },
        userId: Meteor.user()?._id,
      });
      Accounts.createUser({ username, password, profile });
    },
    "users.update": (payload) => {
      const user = Meteor.users.findOne(payload._id);
      const userId = user._id;
      if (user) {
        delete payload._id;
        const modifier = {
          username: payload.username || user.username,
          profile: {
            ...payload.profile,
          },
        };
        Meteor.call("logging.create", {
          key: "users.update",
          before: user,
          after: { modifier },
          userId: Meteor.user()?._id,
        });
        Meteor.users.update(userId, { $set: modifier });
      } else {
        return new Meteor.Error("Error 404", "user was not found", userId);
      }
    },
    "users.remove": (userId) => {
      const user = Meteor.users.findOne(userId);
      if (user) {
        Meteor.call("logging.create", {
          key: "users.remove",
          before: user,
          after: null,
          userId: Meteor.user()?._id,
        });
        Meteor.users.remove(user._id);
      } else {
        return new Meteor.Error("Error 404", "user was not found", userId);
      }
    },
    "set.password": (userId, newPassword, options = { logout: true }) => {
      const user = Meteor.users.findOne(userId);
      if (user) {
        Accounts.setPassword(user._id, newPassword, options);
      } else {
        return new Meteor.Error("Error 404", "user was not found", userId);
      }
    },
  });
}
