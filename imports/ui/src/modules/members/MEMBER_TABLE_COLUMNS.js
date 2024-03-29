import { Badge, Tooltip } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { SquadCollection } from '../../../../api/SquadApi'
import { sortByRank } from '../../libs/SORTER_LIB'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { runTierCheck } from './member.lib'

export const MEMBER_TABLE_COLUMNS = [
  {
    title: 'Dienstgrad',
    dataIndex: 'rank',
    key: 'rank',
    sorter: (a, b) => sortByRank(a.rank, b.rank),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Zugehörigkeit',
    dataIndex: 'designation',
    key: 'designation',
    sorter: (a, b) => a.designation.localeCompare(b.designation),
  },
  {
    title: 'Tier',
    dataIndex: 'tier',
    key: 'tier',
    sorter: (a, b) => a.tier - b.tier,
    filters: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
    ],
    onFilter: (value, record) => record.tier === value,
    render: (tier, record) => {
      const check = runTierCheck(record.tier, record?._id)
      return (
        <Tooltip title={check?.text}>
          <Badge
            style={{ color: check?.color }}
            color={check?.color}
            text={tier}
          />
        </Tooltip>
      )
    },
  },
  {
    title: 'Trupp',
    dataIndex: 'squad',
    key: 'squad',
    render: (squad) => {
      return SquadCollection.findOne(squad)?.squadName || '-'
    },
    sorter: (a, b) =>
      SquadCollection.findOne(a.squad)?.squadName.localeCompare(SquadCollection.findOne(b.squad)?.squadName),
  },
  {
    title: 'Trupp-Position',
    dataIndex: 'squadPosition',
    key: 'squadPosition',
    sorter: (a, b) => a.squadPosition - b.squadPosition,
  },
  {
    title: 'Ausbildungen',
    dataIndex: 'skills',
    key: 'skills',
    render: (skills) => (
      <Tooltip title={skills?.map((skill) => SkillsCollection.findOne(skill)?.name)?.join(', ')}>
        <span style={{ display: 'block', width: '100%' }}>{skills?.length || 0}</span>
      </Tooltip>
    ),
    sorter: (a, b) => a.skills?.length - b.skills?.length,
    filters: SkillsCollection.find({}).map((skill) => ({
      text: skill?.name,
      value: skill._id,
    })),
    onFilter: (value, record) => record.skills?.includes(value),
  },
  {
    title: 'Betrittsdatum',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt) => {
      return dayjs(createdAt).format('DD.MM.YYYY')
    },
    sorter: (a, b) => a.createdAt > b.createdAt,
  },
  {
    title: 'Sicherheitsfreigabe',
    dataIndex: 'securityClearance',
    key: 'securityClearance',
    sorter: (a, b) => a.securityClearance - b.securityClearance,
  },
  {
    title: 'Belohnungspunkte',
    dataIndex: 'points',
    key: 'points',
    sorter: (a, b) => a.points - b.points,
  },
  {
    title: 'Inaktivitätspunkte',
    dataIndex: 'inactivityPoints',
    key: 'inactivityPoints',
    sorter: (a, b) => a.inactivityPoints - b.inactivityPoints,
  },
]
