import { Button, Tooltip } from 'antd'
import { Meteor } from 'meteor/meteor'
import React from 'react'

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
      return (
        <Tooltip
          title={trainers
            ?.map((trainer) => {
              return Meteor.users.findOne(trainer)?.profile?.name || '-'
            })
            .join(', ')}
        >
          <span style={{ display: 'block', width: '100%' }}>{trainers?.length || 0}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => a.squadMember?.length - b.squadMember?.length,
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
  },
  {
    title: 'Ausbildungsart',
    dataIndex: 'type',
    key: 'type',
    render: (type) => getTypeName(type),
    sorter: (a, b) => getTypeName(a.type).localeCompare(getTypeName(b.type)),
    defaultSortOrder: 'ascend',
  },
]
