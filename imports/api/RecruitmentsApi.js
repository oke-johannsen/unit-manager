import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const RecruitmentCollection = new Mongo.Collection('recruitment')

if (Meteor.isServer) {
  Meteor.publish('recruitments', function (filter = {}) {
    return RecruitmentCollection.find(filter)
  })

  Meteor.methods({
    'recruitment.create': (payload) => {
      Meteor.call('logging.create', {
        key: 'recruitment.create',
        before: null,
        after: { ...payload, status: 'open' },
        userId: Meteor.user()?._id,
      })
      RecruitmentCollection.insert({ ...payload, status: 'open' }, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "RecruitmentCollection.insert":', err, res)
          return false
        }
      })
    },
    'recruitment.update': (id, payload) => {
      Meteor.call('logging.create', {
        key: 'recruitment.update',
        before: RecruitmentCollection.findOne(id),
        after: payload,
        userId: Meteor.user()?._id,
      })
      RecruitmentCollection.update(
        id,
        {
          $set: payload,
        },
        (err, res) => {
          if (!err) {
            return true
          } else {
            console.error('Error in "RecruitmentCollection.update":', err, res)
            return false
          }
        }
      )
    },
    'recruitment.remove': (id) => {
      const recruitment = RecruitmentCollection.findOne(id)
      Meteor.call('logging.create', {
        key: 'recruitment.remove',
        before: recruitment,
        after: null,
        userId: Meteor.user()?._id,
      })
      RecruitmentCollection.remove(id, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "RecruitmentCollection.remove":', err, res)
          return false
        }
      })
    },
  })
}
