import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const AttendenceCollection = new Mongo.Collection("attendence");

if (Meteor.isServer) {
  Meteor.publish("attendence.by.user", function (userId) {
    return AttendenceCollection.find({ userId });
  });

  Meteor.methods({
    "attendence.create": (userId, type, date) => {
      AttendenceCollection.insert({ userId, type, date }, (err, res) => {
        if (!err) {
          return true;
        } else {
          console.error('Error in "AttendenceCollection.insert":', err, res);
          return false;
        }
      });
    },
    "attendence.update": (id, payload) => {
      const { userId, type, date } = payload;
      AttendenceCollection.update(
        id,
        { $set: { userId, type, date } },
        (err, res) => {
          if (!err) {
            return true;
          } else {
            console.error('Error in "AttendenceCollection.uppdate":', err, res);
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
          console.error('Error in "AttendenceCollection.uppdate":', err, res);
          return false;
        }
      });
    },
  });
}
