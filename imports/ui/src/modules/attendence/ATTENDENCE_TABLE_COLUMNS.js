import { Button, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { BriefingCollection } from '../../../../api/BriefingsApi'

export const ATTENDENCE_TABLE_COLUMNS = [
  {
    title: 'Titel',
    dataIndex: 'title',
    key: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
    render: (title) => title ?? '-',
    ellispis: true,
  },
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
    render: (userIds, record) => {
      const briefing = BriefingCollection.findOne({ attendenceId: record._id })
      return (
        <Tooltip title={userIds?.map((userId) => Meteor.users.findOne(userId)?.profile?.name).join(', ')}>
          <span style={{ display: 'block', width: '100%' }}>
            {userIds?.length} / {briefing?.attendees?.length ?? '-'}
          </span>
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
  {
    title: 'Anmelden',
    dataIndex: '_id',
    key: '_id',
    render: (_id) => {
      const briefing = BriefingCollection.findOne({ attendenceId: _id })
      if (briefing) {
        const included = briefing?.attendees?.includes(Meteor.userId())
        return (
          <Button
            type={included ? 'default' : 'primary'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const payload = included
                ? briefing.attendees.filter((userId) => userId !== Meteor.userId())
                : [...(briefing.attendees ?? []), Meteor.userId()]
              Meteor.call('briefings.update', _id, { attendees: payload }, (error) =>
                handleCallback(error, `Erfolgreich ${included ? 'abgemeldet' : 'angemeldet'}`)
              )
            }}
          >
            {included ? 'Abmelden' : 'Anmelden'}
          </Button>
        )
      } else {
        return 'Kein Briefing gefunden'
      }
    },
  },
]
