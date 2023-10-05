import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { SquadCollection } from "./SquadApi";
import { SkillsCollection } from "./SkillsApi";

export const UsersCollection = Meteor.users;

if (Meteor.isServer) {
  const updateSquadsBasedOnUser = (
    userId,
    squadId,
    remove = false,
    oldUser
  ) => {
    const members = SquadCollection.findOne(squadId)?.squadMember || [];
    if (remove) {
      const index = members?.indexOf(oldUser?.squad);
      members?.splice(index, 1);
    } else {
      if (user) {
        const user = Meteor.users.findOne(userId);
        if (squadId && members?.indexOf(squadId) === -1) {
          members?.push(userId);
        }
      }
    }
    SquadCollection.update(squadId || oldUser.squad, {
      $set: { squadMember: members },
    });
  };

  const updateSkillsBasedOnUser = (user) => {
    const skills = SkillsCollection.find({ trainers: user._id }).fetch();
    skills.forEach((skill) => {
      const index = skill.trainers?.indexOf(user._id);
      const newTrainers = skill.trainers;
      if (index > -1) {
        newTrainers.splice(index, 1);
      }
      SkillsCollection.update(skill._id, { $set: { trainers: newTrainers } });
    });
  };

  const updateSquadLeadsBasedOnUser = (userId) => {
    const squads = SquadCollection.find({ squadLead: userId }).fetch();
    squads.forEach((squad) => {
      SquadCollection.update(squad._id, { $set: { squadLead: undefined } });
    });
  };
  Meteor.publish(
    "users",
    function (
      filter = {
        $or: [{ "profile.status": "active" }, { "profile.status": "new" }],
      }
    ) {
      return UsersCollection.find(filter);
    }
  );

  Meteor.methods({
    updateSquadsBasedOnUser: (userId, squadId, remove = false, user) => {
      updateSquadsBasedOnUser(userId, squadId, remove, user);
    },
    "user.byId": (userId) => {
      return Meteor.users.findOne(userId);
    },
    "users.create": (payload) => {
      const { username, password } = payload;
      const profile = {
        ...payload?.profile,
        status: "new",
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
          createdAt: payload.createdAt || user.createdAt,
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
        updateSquadsBasedOnUser(user._id, user?.profile?.squad, true, user);
        updateSkillsBasedOnUser(user._id);
        updateSquadLeadsBasedOnUser(user._id);
        Meteor.users.remove(user);
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
