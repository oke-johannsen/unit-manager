import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { SquadCollection } from "./SquadApi";
import { SkillsCollection } from "./SkillsApi";

export const UsersCollection = Meteor.users;

if (Meteor.isServer) {
  const cleanupBeforeUserRemove = (user) => {
    const profile = user?.profile || {};
    const { squad, skills } = profile;
    if (squad) {
      const newSquad = SquadCollection.findOne(squad);
      const squadMember = newSquad?.squadMember;
      const index = squadMember.indexOf(user?._id);
      if (index !== -1) {
        squadMember.splice(index, 1);
      }
      newSquad.squadMember = squadMember;
      if (newSquad.squadLead && newSquad.squadLead === user?._id) {
        newSquad.squadLead = null;
      }
      SquadCollection.update(
        { _id: newSquad._id },
        {
          $set: {
            squadMember: newSquad.squadMember,
            squadLead: newSquad.squadLead,
          },
        }
      );
    }
    if (skills) {
      skills.forEach((skill) => {
        const newSkill = SkillsCollection.findOne(skill._id);
        if (newSkill?.trainers && newSkill?.trainers === user?._id) {
          newSkill.trainers = null;
          SkillsCollection.update(
            { _id: newSkill._id },
            { $set: { trainers: newSkill.trainers } }
          );
        }
      });
    }
  };
  const handleUserUpdateForLinkedFields = (user, modifier) => {
    if (user?.profile?.squad !== modifier?.profile?.squad) {
      // remove from old squad
      const squad = SquadCollection.findOne(user?.profile?.squad);
      if (squad) {
        const squadMember = squad?.squadMember;
        if (squadMember) {
          const index = squadMember.indexOf(user?._id);
          if (index !== -1) {
            squadMember.splice(index, 1);
            squad.squadMember = squadMember;
          }
        }

        if (squad.squadLead === user?._id) {
          squad.squadLead = null;
        }
        SquadCollection.update(
          { _id: squad._id },
          {
            $set: {
              squadMember: squad.squadMember,
              squadLead: squad.squadLead,
            },
          }
        );
      }

      // add to new squad
      const newSquad = SquadCollection.findOne(modifier?.profile?.squad);
      if (newSquad) {
        let newMembers = newSquad?.squadMember;
        if (!newMembers) {
          newMembers = [];
        }
        newMembers.push(user?._id);
        newSquad.squadMember = newMembers;
        SquadCollection.update(
          { _id: newSquad._id },
          { $set: { squadMember: newSquad.squadMember } }
        );
      }
    }
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
      const newUser = UsersCollection.findOne({ username: username });
      if (newUser?.profile?.squad) {
        const squad = SquadCollection.findOne(newUser?.profile?.squad);
        if (squad) {
          squad.squadMember.push(newUser._id);
          SquadCollection.update(
            { _id: squad._id },
            { $set: { squadMember: squad.squadMember } }
          );
        }
      }
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
        handleUserUpdateForLinkedFields(user, modifier);
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
        cleanupBeforeUserRemove(user);
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
