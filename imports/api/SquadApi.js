import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const SquadCollection = new Mongo.Collection("squad");

if (Meteor.isServer) {
  Meteor.publish("squads", function () {
    return SquadCollection.find({});
  });

  const updateSquadOfUsers = (squadMember, squadId) => {
    const users = Meteor.users.find({ _id: { $in: squadMember } }).fetch();
    users.forEach((user) => {
      const newProfile = user.profile;
      newProfile.squadId = squadId;
      Meteor.users.update(user._id, { $set: { profile: newProfile } });
    });
  };

  const updateUsersBasedOnSquad = (squadId) => {
    const users = Meteor.users.find({ "profile.squad": squadId }).fetch();
    users.forEach((user) => {
      const newProfile = user.profile;
      delete newProfile.squad;
      Meteor.users.update(user._id, { $set: { profile: newProfile } });
    });
  };

  Meteor.methods({
    "squad.create": (payload) => {
      const { squadName, designation, squadLead, squadMember, speciality } =
        payload;
      Meteor.call("logging.create", {
        key: "squad.create",
        before: null,
        after: { squadName, designation, squadLead, squadMember, speciality },
        userId: Meteor.user()?._id,
      });
      SquadCollection.insert(
        { squadName, designation, squadLead, squadMember, speciality },
        (err, res) => {
          if (!err) {
            updateSquadOfUsers(squadMember, res);
            return true;
          } else {
            console.error('Error in "SquadCollection.insert":', err, res);
            return false;
          }
        }
      );
    },
    "squad.update": (id, payload) => {
      const { squadName, designation, squadLead, squadMember, speciality } =
        payload;
      Meteor.call("logging.create", {
        key: "squad.update",
        before: SquadCollection.findOne(id),
        after: { squadName, designation, squadLead, squadMember, speciality },
        userId: Meteor.user()?._id,
      });
      SquadCollection.update(
        id,
        {
          $set: { squadName, designation, squadLead, squadMember, speciality },
        },
        (err, res) => {
          if (!err) {
            updateSquadOfUsers(squadMember, id);
            return true;
          } else {
            console.error('Error in "SquadCollection.update":', err, res);
            return false;
          }
        }
      );
    },
    "squad.remove": (id) => {
      const squad = SquadCollection.findOne(id);
      Meteor.call("logging.create", {
        key: "squad.remove",
        before: squad,
        after: null,
        userId: Meteor.user()?._id,
      });
      SquadCollection.remove(id, (err, res) => {
        if (!err) {
          updateUsersBasedOnSquad(squad._id);
          return true;
        } else {
          console.error('Error in "SquadCollection.remove":', err, res);
          return false;
        }
      });
    },
  });
}
