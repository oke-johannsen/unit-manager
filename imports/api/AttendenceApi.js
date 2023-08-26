import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const AttendenceCollection = new Mongo.Collection("attendence");

const setPromotionForUsers = (promotedMembers, date, attendenceId) => {
  if (attendenceId) {
    const attendence = AttendenceCollection.findOne(attendenceId);
    if (attendence) {
      const promotedMembersBefore = attendence.promotedMembers;
      promotedMembers.forEach((userId) => {
        if (!promotedMembersBefore.includes(userId)) {
          updateUserPromotionHistory(userId, date, false);
        }
      });
      promotedMembersBefore.forEach((userId) => {
        if (!promotedMembers.includes(userId)) {
          updateUserPromotionHistory(userId, date, true);
        }
      });
    }
  } else {
    promotedMembers?.forEach((userId) => {
      updateUserPromotionHistory(userId, date, false);
    });
  }
};

const updateUserPromotionHistory = (userId, date, remove) => {
  const user = Meteor.users.findOne(userId);
  if (user?.profile) {
    const promotionHistory = [...(user.profile.promotionHistory || [])];
    if (remove) {
      const index = promotionHistory.indexOf(date);
      promotionHistory.splice(index, 1);
    } else {
      promotionHistory.push(date);
    }
    promotionHistory.sort((a, b) => a - b);
    Meteor.users.update(userId, {
      $set: { "profile.promotionHistory": promotionHistory },
    });
  }
};

if (Meteor.isServer) {
  Meteor.publish("attendence.by.user", function (userId) {
    return AttendenceCollection.find({ userIds: userId });
  });
  Meteor.publish("attendence", function () {
    return AttendenceCollection.find({});
  });

  Meteor.methods({
    "attendence.create": (payload) => {
      const { userIds, type, date, promotedMembers } = payload;
      console.log({ userIds, type, date, promotedMembers });
      setPromotionForUsers(promotedMembers, date);
      AttendenceCollection.insert(
        { userIds, type, date, promotedMembers },
        (err, res) => {
          if (!err) {
            return true;
          } else {
            console.error('Error in "AttendenceCollection.insert":', err, res);
            return false;
          }
        }
      );
    },
    "attendence.update": (id, payload) => {
      const { userIds, type, date, promotedMembers } = payload;
      setPromotionForUsers(promotedMembers, date, id);
      AttendenceCollection.update(
        id,
        { $set: { userIds, type, date, promotedMembers } },
        (err, res) => {
          if (!err) {
            return true;
          } else {
            console.error('Error in "AttendenceCollection.update":', err, res);
            return false;
          }
        }
      );
    },
    "attendence.remove": (id) => {
      AttendenceCollection.remove(id, (err, res) => {
        if (!err) {
          return true;
        } else {
          console.error('Error in "AttendenceCollection.remove":', err, res);
          return false;
        }
      });
    },
  });
}
