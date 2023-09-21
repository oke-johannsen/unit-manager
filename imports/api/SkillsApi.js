import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const SkillsCollection = new Mongo.Collection("skills");

if (Meteor.isServer) {
  Meteor.publish("skills", function () {
    return SkillsCollection.find({});
  });

  Meteor.methods({
    "skills.create": (payload) => {
      const { name, trainers, link, color } = payload;
      Meteor.call("logging.create", {
        key: "skills.create",
        before: null,
        after: { name, trainers, link, color },
        userId: Meteor.user()?._id,
      });
      SkillsCollection.insert({ name, trainers, link, color }, (err, res) => {
        if (!err) {
          return true;
        } else {
          console.error('Error in "SkillsCollection.insert":', err, res);
          return false;
        }
      });
    },
    "skills.update": (id, payload) => {
      const { name, trainers, link, color } = payload;
      Meteor.call("logging.create", {
        key: "skills.update",
        before: SkillsCollection.findOne(id),
        after: { name, trainers, link, color },
        userId: Meteor.user()?._id,
      });
      SkillsCollection.update(
        id,
        { $set: { name, trainers, link, color } },
        (err, res) => {
          if (!err) {
            return true;
          } else {
            console.error('Error in "SkillsCollection.update":', err, res);
            return false;
          }
        }
      );
    },
    "skills.remove": (id) => {
      const skills = SkillsCollection.findOne(id);
      Meteor.call("logging.create", {
        key: "skills.remove",
        before: SkillsCollection.findOne(id),
        after: null,
        userId: Meteor.user()?._id,
      });
      SkillsCollection.remove(skills._id, (err, res) => {
        if (!err) {
          return true;
        } else {
          console.error('Error in "SkillsCollection.remove":', err, res);
          return false;
        }
      });
    },
  });
}