import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const BriefingCollection = new Mongo.Collection('briefings')

const createBriefing = (briefing) => {
  return BriefingCollection.insert(briefing)
}

const updateBriefing = (briefingId, payload) => {
  if (!BriefingCollection.findOne({ _id: briefingId })) {
    return Meteor.Error('briefing-not-found', 'Briefing not found')
  }
  return BriefingCollection.update(briefingId, { $set: payload })
}

const deleteBriefing = (briefingId) => {
  if (BriefingCollection.findOne({ _id: briefingId })) {
    return BriefingCollection.remove(briefingId)
  } else {
    return Meteor.Error('briefing-not-found', 'Briefing not found')
  }
}

if (Meteor.isServer) {
  Meteor.publish('briefings', (filter = {}) => {
    return BriefingCollection.find(filter)
  })
  Meteor.methods({
    'briefings.create': createBriefing,
    'briefings.update': updateBriefing,
    'briefings.delete': deleteBriefing,
  })
}
