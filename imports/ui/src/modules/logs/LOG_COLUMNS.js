import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'

export const LOG_COLUMNS = (users = []) => [
  {
    title: 'Benutzer',
    dataIndex: 'userId',
    key: 'userId',
    filters: users.map((user) => ({ text: user?.username + ' / ' + user?.profile?.name, value: user?._id })),
    onFilter: (value, record) => record.userId === value,
    filterSearch: true,
    render: (userId) => {
      const user = Meteor.users.findOne(userId)
      return user ? user.username + ' / ' + user.profile?.name : 'deleted-user'
    },
    sorter: (a, b) =>
      Meteor.users.findOne(a.userId)?.profile?.name.localeCompare(Meteor.users.findOne(b.userId)?.profile?.name),
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    key: 'operation',
    filters: [
      {
        text: 'users.create',
        value: 'users.create',
      },
      {
        text: 'users.update',
        value: 'users.update',
      },
      {
        text: 'users.remove',
        value: 'users.remove',
      },
      {
        text: 'squads.create',
        value: 'squads.create',
      },
      {
        text: 'squads.update',
        value: 'squads.update',
      },
      {
        text: 'squads.remove',
        value: 'squads.remove',
      },
      {
        text: 'attendence.create',
        value: 'attendence.create',
      },
      {
        text: 'attendence.update',
        value: 'attendence.update',
      },
      {
        text: 'attendence.remove',
        value: 'attendence.remove',
      },
      {
        text: 'recruitment.create',
        value: 'recruitment.create',
      },
      {
        text: 'recruitment.update',
        value: 'recruitment.update',
      },
      {
        text: 'recruitment.remove',
        value: 'recruitment.remove',
      },
      {
        text: 'skills.create',
        value: 'skills.create',
      },
      {
        text: 'skills.update',
        value: 'skills.update',
      },
      {
        text: 'skills.remove',
        value: 'skills.remove',
      },
    ],
    onFilter: (value, record) => record.operation.startsWith(value),
    filterSearch: true,
    sorter: (a, b) => a.operation.localeCompare(b.operation),
  },
  {
    title: 'Zeitpunkt',
    dataIndex: 'timestamp',
    key: 'timestamp',
    sorter: (a, b) => a.timestamp > b.timestamp,
    render: (timestamp) => (timestamp ? dayjs(timestamp).format('DD.MM.YYYY HH:mm') : '-'),
  },
]
