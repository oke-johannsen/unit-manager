import { Button, Tooltip } from 'antd'
import { Meteor } from 'meteor/meteor'
import React, { act } from 'react'
import { getActiveMembers } from '../squads/SQUAD_TABLE_COLUMNS'

export const getTypeName = (type) => {
  let displayName
  switch (type) {
    case 'skill':
      displayName = 'Ausbildung'
      break
    case 'tier-1':
      displayName = 'Tier-1 Lehrgang'
      break
    case 'tier-2':
      displayName = 'Tier-2 Lehrgang'
      break
    case 'special':
      displayName = 'Speziallehrgang'
      break
    case 'test':
      displayName = 'Prüfung'
      break
    default:
      displayName = '-'
      break
  }
  return displayName
}

export const SKILLS_COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Ausbilder',
    dataIndex: 'trainers',
    key: 'trainers',
    render: (trainers) => {
      const activeTrainers = getActiveMembers(trainers)
      return (
        <Tooltip
          title={activeTrainers
            ?.map((trainer) => {
              return Meteor.users.findOne(trainer)?.profile?.name || '-'
            })
            .join(', ')}
        >
          <span style={{ display: 'block', width: '100%' }}>{activeTrainers?.length || 0}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => {
      const activeTrainersA = getActiveMembers(a.trainers)
      const activeTrainersB = getActiveMembers(b.trainers)
      return activeTrainersA?.length - activeTrainersB?.length
    },
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
    render: (link) => {
      return link ? (
        <Button
          type='primary'
          style={{ paddingInline: '1rem' }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            window.open(link, '_blank')
          }}
        >
          Zum Lehrgang
        </Button>
      ) : (
        '-'
      )
    },
    sorter: (a, b) => {
      if (!a.link) a.link = '-'
      if (!b.link) b.link = '-'
      return a.link.localeCompare(b.link)
    },
  },
  {
    title: 'Ausbildungsart',
    dataIndex: 'type',
    key: 'type',
    render: (type) => getTypeName(type),
    sorter: (a, b) => getTypeName(a.type).localeCompare(getTypeName(b.type)),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Mitglieder',
    dataIndex: '_id',
    key: '_id',
    render: (_id) => {
      const users = Meteor.users.find({ 'profile.skills': _id }).map(u => u._id)
      const activeUsers = getActiveMembers(users)
      return (
        <Tooltip
          title={activeUsers
            ?.map((user) => {
              return Meteor.users.findOne(user)?.profile?.name || '-'
            })
            .join(', ')}
        >
          <span style={{ display: 'block', width: '100%' }}>{activeUsers?.length || 0}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => {
      const usersA = Meteor.users.find({ 'profile.skills': a._id }).map(u => u._id)
      const usersB = Meteor.users.find({ 'profile.skills': b._id }).map(u => u._id)
      const activeUsersA = getActiveMembers(usersA)
      const activeUsersB = getActiveMembers(usersB)
      return activeUsersA?.length - activeUsersB?.length
    },
  },
]
