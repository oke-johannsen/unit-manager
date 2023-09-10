import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const SquadCollection = new Mongo.Collection("squad");

const updateSquadOfUsers = (squadMember, squadId) => {
  const userIds = Meteor.users
    .find({ _id: { $in: squadMember } })
    .map((user) => user._id);
  userIds.forEach((userId) => {
    Meteor.users.update(userId, { $set: { "profile.squad": squadId } });
  });
};

if (Meteor.isServer) {
  Meteor.publish("squads", function () {
    return SquadCollection.find({});
  });

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
      });
      SquadCollection.remove(id, (err, res) => {
        if (!err) {
          updateSquadOfUsers(squad?.squadMember);
          return true;
        } else {
          console.error('Error in "SquadCollection.remove":', err, res);
          return false;
        }
      });
    },
  });
}
