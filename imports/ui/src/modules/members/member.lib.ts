import { Meteor } from 'meteor/meteor'
import { AttendenceCollection } from '../../../../api/AttendenceApi'
import { SkillsCollection } from '../../../../api/SkillsApi'

const notReady = {
  color: 'red',
  text: 'Nicht freigegeben',
}

const combatReady = {
  color: 'white',
  text: 'Combat Ready',
}

const readyForTest = {
  color: 'green',
  text: 'Prüfung freigegeben',
}

const tier1Check = (id: any) => {
  return combatReady
}

const tier2Check = (id: any) => {
  return combatReady
}

const getMemberById = (memberId: string) => {
  return Meteor.users.findOne({ _id: memberId })
}

const memberHasCompletedXMissions = (memberId: string, x: number) => {
  const member = getMemberById(memberId)
  if (member) {
    const attendence = AttendenceCollection.find({ userIds: member._id, type: 'mission' }).count()
    return attendence >= x
  } else {
    return false
  }
}

const checkIfMemberHasEverySkill = (skillType: string, member: any) => {
  const skillsOfType = SkillsCollection.find({ type: skillType }, { fields: { _id: 1 } }).map((skill) => skill._id)
  // check if member.profile.skills includes all skills of type
  const skills = member?.profile?.skills
  if (!skills) return false
  if (!skillsOfType) return false
  if (!skillsOfType.length) return false
  if (!skills.length) return false

  return skillsOfType.every((skill) => skills.includes(skill))
}

const memberHasCompletedAllTierSkills = (memberId: string, skillType: string) => {
  const member = getMemberById(memberId)
  if (member?.profile?.skills) {
    return checkIfMemberHasEverySkill(skillType, member)
  } else {
    return false
  }
}

const tier3Check = (id: any) => {
  const memberId = id ?? ''
  const hasCompletedXMissions = memberHasCompletedXMissions(memberId, 5)
  const hasCompletedAllTierSkills = memberHasCompletedAllTierSkills(memberId, 'tier-2')
  if (hasCompletedXMissions && !hasCompletedAllTierSkills) {
    return notReady
  } else if (hasCompletedXMissions && hasCompletedAllTierSkills) {
    return readyForTest
  } else {
    return combatReady
  }
}

const getTierCheck = (tier: number) => {
  switch (tier) {
    case 1:
      return tier1Check
    case 2:
      return tier2Check
    case 3:
      return tier3Check
    default:
      return () => combatReady
  }
}

const runTierCheck = (tier: number, id: any) => {
  const check = getTierCheck(tier)
  if (!check) return false
  return check(id)
}

export { runTierCheck }
