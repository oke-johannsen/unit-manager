import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { SquadCollection } from "./SquadApi";

export const UsersCollection = Meteor.users;

const updateSquadsBasedOnUser = (userId, squadId, remove = false) => {
  const user = Meteor.users.findOne(userId);
  if (user) {
    const members = SquadCollection.findOne(squadId)?.squadMember || [];
    if (squadId && members?.indexOf(squadId) === -1 && !remove) {
      members?.push(userId);
    } else {
      const index = members?.indexOf(user.squad);
      members?.splice(index, 1);
    }
    SquadCollection.update(squadId || user.squad, {
      $set: { squadMember: members },
    });
  }
};

if (Meteor.isServer) {
  Meteor.publish("users", function (filter = { "profile.status": "active" }) {
    return UsersCollection.find(filter);
  });

  Meteor.methods({
    updateSquadsBasedOnUser: (userId, squadId) => {
      updateSquadsBasedOnUser(userId, squadId);
    },
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
        if (user.profile?.squad !== modifier.profile.squad) {
          updateSquadsBasedOnUser(userId, modifier?.profile?.squad);
        }
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
        updateSquadsBasedOnUser(user._id, user?.profile?.squad, true);
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
