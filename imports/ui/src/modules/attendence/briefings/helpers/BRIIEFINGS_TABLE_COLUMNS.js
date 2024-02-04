import { Button, Col, Divider, Row, Tooltip, message } from 'antd'
import { AttendenceCollection } from '../../../../../../api/AttendenceApi'
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { BriefingCollection } from '../../../../../../api/BriefingsApi'

const handleCallback = (error, text) => {
  if (error) {
    console.error(error)
  } else {
    message.success(text)
  }
}

const handleDelete = (e, id) => {
  e.preventDefault()
  e.stopPropagation()
  Meteor.call('briefings.delete', id, (error) => handleCallback(error, 'Erfolgreich gelöscht'))
}

const handleClick = (e, id) => {
  e.preventDefault()
  e.stopPropagation()
  const briefing = BriefingCollection.findOne({ _id: id })
  let payload = briefing?.attendees ?? []
  const included = briefing?.attendees?.includes(Meteor.userId())
  if (included) {
    payload = briefing.attendees.filter((attendee) => attendee !== Meteor.userId())
  } else {
    payload = [...(briefing.attendees ?? []), Meteor.userId()]
  }
  Meteor.call('briefings.update', id, { attendees: payload }, (error) =>
    handleCallback(error, `Erfolgreich ${included ? 'abgemeldet' : 'angemeldet'}`)
  )
}

const BRIEFINGS_TABLE_COLUMNS = [
  {
    title: 'Einsatz',
    dataIndex: 'attendenceId',
    key: 'attendenceId',
    sorter: (a, b) => {
      const attendenceA = AttendenceCollection.findOne({ _id: a.attendenceId })
      const attendenceB = AttendenceCollection.findOne({ _id: b.attendenceId })
      return attendenceA?.title.localeCompare(attendenceB?.title)
    },
    render: (attendenceId) => {
      const attendence = AttendenceCollection.findOne({ _id: attendenceId })
      return attendence?.title
    },
  },
  {
    title: 'Angemeldet',
    dataIndex: 'attendees',
    key: 'attendees',
    sorter: (a, b) => a.attendees.length - b.attendees.length,
    render: (attendees) => {
      const users = attendees?.map((attendee) => Meteor.users.findOne({ _id: attendee })?.profile?.name)
      return (
        <Tooltip title={users?.join(', ')}>
          <Row>
            <Col>{users?.length}</Col>
          </Row>
        </Tooltip>
      )
    },
  },
  {
    title: 'Aktionen',
    dataIndex: '_id',
    key: '_id',
    render: (_, record) => {
      const included = record.attendees?.includes(Meteor.userId())
      return (
        <Row
          gutter={[16, 16]}
          key={`action-${record._id}`}
        >
          <Col key={`sign-up-${record._id}`}>
            <Button
              type={included ? 'default' : 'primary'}
              onClick={(e) => handleClick(e, record._id)}
            >
              {included ? <MinusOutlined /> : <PlusOutlined />}
              <Divider type='vertical' />
              {included ? 'Abmelden' : 'Anmelden'}
            </Button>
          </Col>
          {Meteor.user()?.profile?.securityClearance > 2 && (
            <Col key={`delete-${record._id}`}>
              <Button
                onClick={(e) => handleDelete(e, record._id)}
                danger
              >
                <DeleteOutlined />
                <Divider type='vertical' />
                Löschen
              </Button>
            </Col>
          )}
        </Row>
      )
    },
  },
]

export default BRIEFINGS_TABLE_COLUMNS
