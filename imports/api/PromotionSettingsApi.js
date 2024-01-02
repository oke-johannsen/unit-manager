import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const PromotionSettingsCollection = new Mongo.Collection('promotionSettings')

if (Meteor.isServer) {
  Meteor.publish('promotionSettings', function () {
    return PromotionSettingsCollection.find({})
  })
  Meteor.methods({
    'promotionSettings.create': (payload) => {
      const { rank, missions, trainings, skills } = payload
      Meteor.call('logging.create', {
        key: 'promotionSettings.create',
        before: null,
        after: { rank, missions, trainings, skills },
        userId: Meteor.user()?._id,
      })
      PromotionSettingsCollection.insert({ rank, missions, trainings, skills }, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "PromotionSettingsCollection.insert":', err, res)
          return false
        }
      })
    },
    'promotionSettings.update': (id, payload) => {
      const { rank, missions, trainings, skills } = payload
      Meteor.call('logging.create', {
        key: 'promotionSettings.update',
        before: PromotionSettingsCollection.findOne(id),
        after: { rank, missions, trainings, skills },
        userId: Meteor.user()?._id,
      })
      PromotionSettingsCollection.update(id, { $set: { rank, missions, trainings, skills } }, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "PromotionSettingsCollection.update":', err, res)
          return false
        }
      })
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
