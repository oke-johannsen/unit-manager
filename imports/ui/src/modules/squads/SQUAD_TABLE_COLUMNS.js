import { Tooltip } from 'antd'
import React from 'react'
import { Meteor } from 'meteor/meteor'

export const SQUAD_TABLE_COLUMNS = [
  {
    title: 'Truppname',
    dataIndex: 'squadName',
    key: 'squadName',
    sorter: (a, b) => a.squadName.localeCompare(b.squadName),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Zugehörigkeit',
    dataIndex: 'designation',
    key: 'designation',
    sorter: (a, b) => a.designation.localeCompare(b.designation),
  },
  {
    title: 'Truppführung',
    dataIndex: 'squadLead',
    key: 'squadLead',
    render: (squadLead) => {
      return Meteor.users.findOne(squadLead)?.profile?.name || '-'
    },
    sorter: (a, b) =>
      Meteor.users.findOne(a.squadLead)?.profile?.name.localeCompare(Meteor.users.findOne(b.squadLead)?.profile?.name),
  },
  {
    title: 'Truppmitglieder',
    dataIndex: 'squadMember',
    key: 'squadMember',
    render: (squadMember) => (
      <Tooltip
        title={squadMember
          ?.map((member) => {
            return Meteor.users.findOne(member)?.profile?.name || '-'
          })
          .join(', ')}
      >
        <span style={{ display: 'block', width: '100%' }}>{squadMember?.length || 0}</span>
      </Tooltip>
    ),
    sorter: (a, b) => a.squadMember?.length - b.squadMember?.length,
  },
  {
    title: 'Spezialisierung',
    dataIndex: 'speciality',
    key: 'speciality',
    sorter: (a, b) => a.speciality.localeCompare(b.speciality),
  },
]
