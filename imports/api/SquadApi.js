import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const SquadCollection = new Mongo.Collection('squad')

if (Meteor.isServer) {
  const cleanupBeforeSquadRemove = (squad) => {
    ;(squad.squadMember || []).forEach((userId) => {
      const user = Meteor.users.findOne(userId)
      user.profile.squad = null
      Meteor.users.update({ _id: user._id }, { $set: { profile: user.profile } })
    })
  }
  const handleSquadUpdateOfLinkedFields = (squad, squadMember) => {
    if (squad.squadMember !== squadMember) {
      squadMember.forEach((userId) => {
        // users were added
        if (!squad.squadMember) {
          squad.squadMember = []
        }
        if (!squad.squadMember.includes(userId)) {
          const user = Meteor.users.findOne(userId)
          user.profile.squad = squad._id
          Meteor.users.update({ _id: user._id }, { $set: { profile: user.profile } })
        }
      })
      squad.squadMember.forEach((userId) => {
        // users were removed
        if (!squadMember.includes(userId)) {
          const user = Meteor.users.findOne(userId)
          if (user) {
            user.profile.squad = null
            Meteor.users.update({ _id: user._id }, { $set: { profile: user.profile } })
          }
        }
      })
    }
  }
  Meteor.publish('squads', function () {
    return SquadCollection.find({})
  })
  Meteor.methods({
    'squad.create': (payload) => {
      const { squadName, designation, squadLead, squadMember, speciality } = payload
      Meteor.call('logging.create', {
        key: 'squad.create',
        before: null,
        after: { squadName, designation, squadLead, squadMember, speciality },
        userId: Meteor.user()?._id,
      })
      SquadCollection.insert({ squadName, designation, squadLead, squadMember, speciality }, (err, res) => {
        if (!err) {
          if (squadMember) {
            squadMember.forEach((userId) => {
              const user = Meteor.users.findOne(userId)
              user.profile.squad = res
              Meteor.users.update({ _id: user._id }, { $set: { profile: user.profile } })
            })
          }
          return true
        } else {
          console.error('Error in "SquadCollection.insert":', err, res)
          return false
        }
      })
    },
    'squad.update': (id, payload) => {
      const { squadName, designation, squadLead, squadMember, speciality } = payload
      const squad = SquadCollection.findOne(id)
      Meteor.call('logging.create', {
        key: 'squad.update',
        before: squad,
        after: { squadName, designation, squadLead, squadMember, speciality },
        userId: Meteor.user()?._id,
      })
      handleSquadUpdateOfLinkedFields(squad, squadMember)
      SquadCollection.update(
        id,
        {
          $set: {
            squadName: squadName,
            designation: designation,
            squadLead: squadLead || null,
            squadMember: squadMember,
            speciality: speciality,
          },
        },
        (err, res) => {
          if (!err) {
            return true
          } else {
            console.error('Error in "SquadCollection.update":', err, res)
            return false
          }
        }
      )
    },
    'squad.remove': (id) => {
      const squad = SquadCollection.findOne(id)
      cleanupBeforeSquadRemove(squad)
      Meteor.call('logging.create', {
        key: 'squad.remove',
        before: squad,
        after: null,
        userId: Meteor.user()?._id,
      })
      SquadCollection.remove(id, (err, res) => {
        if (!err) {
          return true
        } else {
          console.error('Error in "SquadCollection.remove":', err, res)
          return false
        }
      })
    },
  })
}
