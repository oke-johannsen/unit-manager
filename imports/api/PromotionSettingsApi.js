import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const PromotionSettingsCollection = new Mongo.Collection('promotionSettings')

if (Meteor.isServer) {
  Meteor.publish('promotionSettings', function () {
    return PromotionSettingsCollection.find({})
  })
  Meteor.methods({
    'promotionSettings.create': (payload) => {
      const { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills } = payload
      Meteor.call('logging.create', {
        key: 'promotionSettings.create',
        before: null,
        after: { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills },
        userId: Meteor.user()?._id,
      })
      PromotionSettingsCollection.insert(
        { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills },
        (err, res) => {
          if (!err) {
            return true
          } else {
            console.error('Error in "PromotionSettingsCollection.insert":', err, res)
            return false
          }
        }
      )
    },
    'promotionSettings.update': (id, payload) => {
      const { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills } = payload
      Meteor.call('logging.create', {
        key: 'promotionSettings.update',
        before: PromotionSettingsCollection.findOne(id),
        after: { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills },
        userId: Meteor.user()?._id,
      })
      PromotionSettingsCollection.update(
        id,
        { $set: { previousRank, nextRank, missions, trainings, skills, optionalSkillsAmount, optionalSkills } },
        (err, res) => {
          if (!err) {
            return true
          } else {
            console.error('Error in "PromotionSettingsCollection.update":', err, res)
            return false
          }
        }
      )
    },
    'promotionSettings.remove': (id) => {
      const skill = PromotionSettingsCollection.findOne(id)
      Meteor.call('logging.create', {
        key: 'promotionSettings.remove',
        before: PromotionSettingsCollection.findOne(id),
        after: null,
        userId: Meteor.user()?._id,
      })
      cleanupBeforeSkillRemove(skill)
      PromotionSettingsCollection.remove(skill._id, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "PromotionSettingsCollection.remove":', err, res)
          return false
        }
      })
    },
  })
}
