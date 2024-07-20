import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import { AttendenceCollection } from './AttendenceApi'
import { PromotionSettingsCollection } from './PromotionSettingsApi'
import { SkillsCollection } from './SkillsApi'
import { SquadCollection } from './SquadApi'

export const UsersCollection = Meteor.users

if (Meteor.isServer) {
  const cleanupBeforeUserRemove = (user) => {
    const profile = user?.profile || {}
    const { squad } = profile
    if (squad) {
      const newSquad = SquadCollection.findOne(squad)
      const squadMember = newSquad?.squadMember
      const index = squadMember.indexOf(user?._id)
      if (index !== -1) {
        squadMember.splice(index, 1)
      }
      newSquad.squadMember = squadMember
      if (newSquad.squadLead && newSquad.squadLead === user?._id) {
        newSquad.squadLead = null
      }
      SquadCollection.update(
        { _id: newSquad._id },
        {
          $set: {
            squadMember: newSquad.squadMember,
            squadLead: newSquad.squadLead,
          },
        }
      )
    }
    SkillsCollection.find({ trainers: user?._id }).forEach((skill) => {
      const newSkill = skill
      newSkill.trainers = newSkill.trainers.filter((trainer) => trainer !== user?._id)
      SkillsCollection.update({ _id: newSkill._id }, { $set: { trainers: newSkill.trainers } })
    })
  }
  const handleUserUpdateForLinkedFields = (user, modifier) => {
    if (user?.profile?.squad !== modifier?.profile?.squad) {
      // remove from old squad
      const squad = SquadCollection.findOne(user?.profile?.squad)
      if (squad) {
        const squadMember = squad?.squadMember
        if (squadMember) {
          const index = squadMember.indexOf(user?._id)
          if (index !== -1) {
            squadMember.splice(index, 1)
            squad.squadMember = squadMember
          }
        }

        if (squad.squadLead === user?._id) {
          squad.squadLead = null
        }
        SquadCollection.update(
          { _id: squad._id },
          {
            $set: {
              squadMember: squad.squadMember,
              squadLead: squad.squadLead,
            },
          }
        )
      }

      // add to new squad
      const newSquad = SquadCollection.findOne(modifier?.profile?.squad)
      if (newSquad) {
        let newMembers = newSquad?.squadMember
        if (!newMembers) {
          newMembers = []
        }
        newMembers.push(user?._id)
        newSquad.squadMember = newMembers
        SquadCollection.update({ _id: newSquad._id }, { $set: { squadMember: newSquad.squadMember } })
      }
    }
    if (modifier?.profile?.status === 'inactive') {
      SkillsCollection.find({ trainers: user?._id }).forEach((skill) => {
        const newSkill = skill
        newSkill.trainers = newSkill.trainers.filter((trainer) => trainer !== user?._id)
        SkillsCollection.update({ _id: newSkill._id }, { $set: { trainers: newSkill.trainers } })
      })
    }
  }
  const getPromotionSettingForRank = (rank) => {
    return PromotionSettingsCollection.findOne({ previousRank: rank })
  }
  Meteor.publish('users',
    function (filter = { $or: [{ 'profile.status': 'active' }, { 'profile.status': 'new' }] }) {
      return UsersCollection.find(filter)
    }
  )
  Meteor.methods({
    'user.byId': (userId) => {
      return Meteor.users.findOne(userId)
    },
    'users.create': (payload) => {
      const { username, password } = payload
      const profile = {
        ...payload?.profile,
        status: 'new',
      }
      Meteor.call('logging.create', {
        key: 'users.create',
        before: null,
        after: { username, profile },
        userId: Meteor.user()?._id,
      })

      Accounts.createUser({ username, password, profile })
      const newUser = UsersCollection.findOne({ username: username })
      if (newUser?.profile?.squad) {
        const squad = SquadCollection.findOne(newUser?.profile?.squad)
        if (squad) {
          squad.squadMember.push(newUser._id)
          SquadCollection.update({ _id: squad._id }, { $set: { squadMember: squad.squadMember } })
        }
      }
    },
    'users.update': (payload) => {
      const user = Meteor.users.findOne(payload._id)
      const userId = user._id
      if (user) {
        delete payload._id
        const modifier = {
          username: payload.username || user.username,
          createdAt: payload.createdAt || user.createdAt,
          profile: {
            ...payload.profile,
          },
        }
        handleUserUpdateForLinkedFields(user, modifier)
        Meteor.call('logging.create', {
          key: 'users.update',
          before: user,
          after: { modifier },
          userId: Meteor.user()?._id,
        })
        Meteor.users.update(userId, { $set: modifier })
      } else {
        return new Meteor.Error('Error 404', 'user was not found', userId)
      }
    },
    'users.remove': (userId) => {
      const user = Meteor.users.findOne({ _id: userId ?? null })
      if (user) {
        Meteor.call('logging.create', {
          key: 'users.remove',
          before: user,
          after: null,
          userId: Meteor.user()?._id,
        })
        cleanupBeforeUserRemove(user)
        Meteor.users.remove({ _id: user?._id })
      } else {
        return new Meteor.Error('Error 404', 'user was not found', userId)
      }
    },
    'set.password': (userId, newPassword, options = { logout: true }) => {
      const user = Meteor.users.findOne(userId)
      if (user) {
        Accounts.setPassword(user._id, newPassword, options)
      } else {
        return new Meteor.Error('Error 404', 'user was not found', userId)
      }
    },
    'user.get.promotion.data': (userId) => {
      const user = Meteor.users.findOne(userId ?? null)
      if (user) {
        const profile = user?.profile
        const date = profile?.promotionHistory?.length
          ? profile.promotionHistory[profile?.promotionHistory?.length - 1]
          : user?.createdAt
        const settings = getPromotionSettingForRank(profile?.rank)
        const skills = settings ? profile.skills?.filter((skill) => settings?.skills?.includes(skill)) : []
        const optionalSkills = settings
          ? profile.skills?.filter((skill) => (settings?.optionalSkills ?? [])?.includes(skill))
          : []
        const missionsSinceLastPromotion = AttendenceCollection.find({
          userIds: user?._id,
          type: 'mission',
          date: { $gt: date },
        }).count()
        const trainingsCount = AttendenceCollection.find({
          userIds: user?._id,
          type: 'training',
        }).count()

        const lengthSettings =
          settings?.skills?.length +
          Number(settings?.missions) +
          Number(settings?.trainings) +
          Number(settings?.optionalSkillsAmount ?? 0)
        const lengthCompleted =
          skills?.length +
          (missionsSinceLastPromotion > Number(settings?.missions)
            ? Number(settings?.missions)
            : missionsSinceLastPromotion) +
          (trainingsCount > Number(settings?.trainings) ? Number(settings?.trainings) : trainingsCount) +
          optionalSkills?.length
        const percent = settings ? Math.round((lengthCompleted / lengthSettings) * 100) : 0

        const missingSkills = settings?.skills
          ?.filter((skill) => !skills?.includes(skill))
          ?.map((s) => SkillsCollection.findOne(s)?.name)
        const missingMissions = Number(settings?.missions) - missionsSinceLastPromotion
        const missingTrainings = Number(settings?.trainings) - trainingsCount
        const missingOptionalSkillsAmount = Number(settings?.optionalSkillsAmount ?? 0) - optionalSkills?.length
        return { percent, missingSkills, missingMissions, missingTrainings, missingOptionalSkillsAmount }
      } else {
        return new Meteor.Error('Error', 'user was not found', userId)
      }
    },
    'users.get.promotion.data': (userIds) => {
      if (Array.isArray(userIds)) {
        const users = Meteor.users.find({ _id: { $in: userIds } }).map((user) => {
          const { percent, missingSkills, missingMissions, missingTrainings, missingOptionalSkillsAmount } =
            Meteor.call('user.get.promotion.data', user._id)
          return {
            ...user,
            percent,
            missingSkills,
            missingMissions,
            missingTrainings,
            missingOptionalSkillsAmount,
          }
        })
        return users
      } else {
        return new Meteor.Error('Error', 'userIds were no array', userIds)
      }
    },
  })
}
