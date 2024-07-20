import { Tooltip } from 'antd'
import { Meteor } from 'meteor/meteor'
import React from 'react'

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
    render: (squadMember) => {
      const activeMembers = getActiveMembers(squadMember)
      return (
        <Tooltip
          title={activeMembers
            ?.map((member) => {
              return Meteor.users.findOne(member)?.profile?.name || '-'
            })
            .join(', ')}
        >
          <span style={{ display: 'block', width: '100%' }}>{activeMembers?.length || 0}</span>
        </Tooltip>
      )
    },
    sorter: (a, b) => {
      const activeMembersA = getActiveMembers(a.squadMember)
      const activeMembersB = getActiveMembers(b.squadMember)
      return activeMembersA?.length - activeMembersB?.length
    },
  },
  {
    title: 'Spezialisierung',
    dataIndex: 'speciality',
    key: 'speciality',
    sorter: (a, b) => a.speciality.localeCompare(b.speciality),
  },
]

export const getActiveMembers = (member = []) => {
  if (!Array.isArray(member)) member = []
  const userOptions = Meteor.users.find({ 'profile.status': { $in: ['active', 'new'] } }).map((user) => {
    return {
      label: user?.profile?.name,
      value: user?._id,
    }
  })
  const activeMembers = (member || []).filter((id) => userOptions.find((user) => user.value === id))
  return activeMembers
}
