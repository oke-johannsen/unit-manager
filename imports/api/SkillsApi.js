import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const SkillsCollection = new Mongo.Collection("skills");

if (Meteor.isServer) {
  const cleanupBeforeSkillRemove = (skill) => {
    const members = Meteor.users.find({ "profile.skills": skill._id }).fetch();
    members.forEach((user) => {
      const newUser = user;
      const skills = newUser?.profile?.skills || [];
      newUser.profile.skills = skills.filter((item) => item !== skill._id);
      const userId = newUser._id;
      const profile = newUser.profile;
      Meteor.users.update({ _id: userId }, { $set: { profile: profile } });
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
    "skills.update.many": (values) => {
      const { members, skillId } = values;
      members?.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          Meteor.users.update(
            user._id,
            {
              $set: {
                profile: {
                  ...user.profile,
                  skills: [...(user.profile.skills || []), skillId],
                },
              },
            },
            (err, res) => {
              if (!err) {
                return true;
              } else {
                console.error('Error in "Meteor.users.update":', err, res);
                return false;
              }
            }
          );
        }
      });
    },
    "skills.remove": (id) => {
      const skill = SkillsCollection.findOne(id);
      Meteor.call("logging.create", {
        key: "skills.remove",
        before: SkillsCollection.findOne(id),
        after: null,
        userId: Meteor.user()?._id,
      });
      cleanupBeforeSkillRemove(skill);
      SkillsCollection.remove(skill._id, (err, res) => {
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
