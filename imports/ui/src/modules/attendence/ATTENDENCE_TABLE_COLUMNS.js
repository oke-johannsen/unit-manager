import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'
import React from 'react'

export const ATTENDENCE_TABLE_COLUMNS = [
  {
    title: 'Datum',
    dataIndex: 'date',
    key: 'date',
    render: (date) => dayjs(date).format('DD.MM.YYYY'),
    sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    defaultSortOrder: 'descend',
  },
  {
    title: 'Art',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (type === 'mission' ? 'Mission' : type === 'training' ? 'Training' : type),
    sorter: (a, b) => a.type.localeCompare(b.type),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Teilnehmer',
    dataIndex: 'userIds',
    key: 'userIds',
    render: (userIds) => {
      return (
        <Tooltip title={userIds?.map((userId) => Meteor.users.findOne(userId)?.profile?.name).join(', ')}>
          <span style={{ display: 'block', width: '100%' }}>{userIds?.length}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => a.userIds?.length - b.userIds?.length,
  },
  {
    title: 'Beförderte Mitglieder',
    dataIndex: 'promotedMembers',
    key: 'promotedMembers',
    render: (promotedMembers) => {
      return (
        <Tooltip title={promotedMembers?.map((userId) => Meteor.users.findOne(userId)?.profile?.name).join(', ')}>
          <span style={{ display: 'block', width: '100%' }}>{promotedMembers?.length}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => a.promotedMembers?.length - b.promotedMembers?.length,
  },
]
