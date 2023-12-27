import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const LoggingCollection = new Mongo.Collection('logging')

if (Meteor.isServer) {
  Meteor.publish('logging.by.user', function (userId) {
    return LoggingCollection.find({ userIds: userId })
  })
  Meteor.publish('logging', function () {
    return LoggingCollection.find({})
  })

  Meteor.methods({
    'logging.create': (payload) => {
      const { before, after, key, userId } = payload
      LoggingCollection.insert({ key, before, after, userId, timestamp: new Date() }, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "LoggingCollection.insert":', err, res)
          return false
        }
      })
    },
    'logging.update': (id, payload) => {
      const { before, after, key, userId } = payload
      LoggingCollection.update(id, { $set: { key, before, after, userId } }, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "LoggingCollection.update":', err, res)
          return false
        }
      })
    },
    'logging.remove': (id) => {
      const logging = LoggingCollection.findOne(id)
      LoggingCollection.remove(logging._id, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "LoggingCollection.remove":', err, res)
          return false
        }
      })
    },
  })
}
