import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import '../imports/api/AttendenceApi'
import '../imports/api/AttendenceTypesApi'
import '../imports/api/BriefingsApi'
import '../imports/api/LoggingApi'
import { LoggingCollection } from '../imports/api/LoggingApi'
import '../imports/api/PromotionSettingsApi'
import '../imports/api/RecruitmentsApi'
import { RecruitmentCollection } from '../imports/api/RecruitmentsApi'
import '../imports/api/SkillsApi'
import '../imports/api/SquadApi'
import '../imports/api/UsersApi'
import { UsersCollection } from '../imports/api/UsersApi'

Meteor.startup(async () => {
  const defaultAdmin = UsersCollection.findOne({ username: 'mando' })
  const defaultServiceUser = UsersCollection.findOne({
    username: 'service-admin',
  })
  if (!defaultAdmin) {
    Accounts.createUser({
      username: 'mando',
      password: 'Test-123*',
      profile: {
        name: 'Oke Johannsen',
        tier: null,
        rank: null,
        designation: null,
        squadPosition: null,
        securityClearance: 4,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
        promotionHistory: [],
      },
    })
  }
  if (!defaultServiceUser) {
    Accounts.createUser({
      username: 'service-admin',
      password: 'tJ7n89J2vum8yWKV6U88',
      profile: {
        name: 'TF11 Service Account',
        tier: null,
        rank: null,
        designation: null,
        squadPosition: null,
        securityClearance: 4,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
        promotionHistory: [],
      },
    })
  }

  // migration: add createdAt to existing recruitments
  const recruitments = RecruitmentCollection.find({ $or: [{ createdAt: null }, { createdAt: { $exists: false } }] }).fetch()
  if (recruitments.length) {
    recruitments.forEach((recruitment) => {
      const logEntry = LoggingCollection.findOne({ key: 'recruitment.create', 'after.preferedName': recruitment.preferedName, 'after.discordId': recruitment.discordId, 'after.steamProfile': recruitment.steamProfile })
      if (logEntry?.timestamp) RecruitmentCollection.update({ _id: recruitment._id }, { $set: { createdAt: logEntry?.timestamp } })
    })
  }
})
