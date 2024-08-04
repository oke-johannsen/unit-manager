import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const AttendenceTypeCollection = new Mongo.Collection('attendenceTypes')

if (Meteor.isServer) {
  Meteor.publish('attendenceTypes', function () {
    return AttendenceTypeCollection.find({})
  })
  Meteor.methods({
    'attendenceTypes.create': (payload) => {
      const { name, zeusLabel } = payload
      Meteor.call('logging.create', {
        key: 'attendenceTypes.create',
        before: null,
        after: {
          name,
          zeusLabel,
        },
        userId: Meteor.user()?._id,
      })
      AttendenceTypeCollection.insert({ value: name, label: name, zeusLabel }, (err, res) => {
        if (err) {
          console.error(err, res)
        }
      })
    },
    'attendenceTypes.update': (id, payload) => {
      const { name, zeusLabel } = payload
      const attendenceTypes = AttendenceTypeCollection.findOne(id)
      Meteor.call('logging.create', {
        key: 'attendenceTypes.update',
        before: attendenceTypes,
        after: {
          name,
          zeusLabel,
        },
        userId: Meteor.user()?._id,
      })
      AttendenceTypeCollection.update(
        id,
        {
          $set: {
            value: name,
            label: name,
            zeusLabel,
          },
        },
        (err, res) => {
          if (err) {
            console.error(err, res)
          }
        }
      )
    },
    'attendenceTypes.remove': (id) => {
      const attendenceTypes = AttendenceTypeCollection.findOne(id)
      Meteor.call('logging.create', {
        key: 'attendenceTypes.remove',
        before: attendenceTypes,
        after: null,
        userId: Meteor.user()?._id,
      })
      AttendenceTypeCollection.remove(id, (err, res) => {
        if (err) {
          console.error(err, res)
        }
      })
    },
  })
}
