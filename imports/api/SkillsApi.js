import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const SkillsCollection = new Mongo.Collection("skills");

if (Meteor.isServer) {
  const updateUsersOnSkillRemove = (skill) => {
    const users = Meteor.users.find({ "profile.skills": skill._id }).fetch();
    users.forEach((user) => {
      const newSkills = user.profile?.skills;
      const index = newSkills.indexOf(skill._id);
      newSkills.splice(index, 1);
      Meteor.users.update(user._id, { $set: { "profile.skills": newSkills } });
    });
  };
  Meteor.publish("skills", function () {
    return SkillsCollection.find({});
  });

  Meteor.methods({
    "skills.create": (payload) => {
      const { name, trainers, link, color, type } = payload;
      Meteor.call("logging.create", {
        key: "skills.create",
        before: null,
        after: { name, trainers, link, color, type },
        userId: Meteor.user()?._id,
      });
      SkillsCollection.insert(
        { name, trainers, link, color, type },
        (err, res) => {
          if (!err) {
            return true;
          } else {
            console.error('Error in "SkillsCollection.insert":', err, res);
            return false;
          }
        }
      );
    },
    "skills.update": (id, payload) => {
      const { name, trainers, link, color, type } = payload;
      Meteor.call("logging.create", {
        key: "skills.update",
        before: SkillsCollection.findOne(id),
        after: { name, trainers, link, color, type },
        userId: Meteor.user()?._id,
      });
      SkillsCollection.update(
        id,
        { $set: { name, trainers, link, color, type } },
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
      updateUsersOnSkillRemove(skills);
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
