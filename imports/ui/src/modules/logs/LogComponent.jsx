import { Col, DatePicker, Modal, Row, Segmented, Spin, Table } from 'antd'
import dayjs from 'dayjs'
import { diffJson } from 'diff'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useMemo, useState } from 'react'
import { LoggingCollection } from '../../../../api/LoggingApi'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { SquadCollection } from '../../../../api/SquadApi'
import { LOG_COLUMNS } from './LOG_COLUMNS'
const { RangePicker } = DatePicker

const mapUserIdToUserName = (userId) => {
  if (!userId) return userId
  const user = Meteor.users.findOne(userId)
  return user?.profile?.name
}

const mapSkillIdToSkillName = (skillId) => {
  if (!skillId) return skillId
  const skill = SkillsCollection.findOne(skillId)
  return skill?.name
}

const mapSquadIdToSquadName = (squadId) => {
  if (!squadId) return squadId
  const squad = SquadCollection.findOne(squadId)
  return squad?.name
}

const transformLogEntry = (item) => {
  const collection = item.key.split('.')[0]
  const before = item?.before
  if (before?._id) before._id = undefined
  if (before?.createdAt) before.createdAt = undefined
  if (before?.services) before.services = undefined
  const after = item?.after?.modifier ?? item?.after
  if (after?._id) after._id = undefined
  if (after?.createdAt) after.createdAt = undefined
  if (after?.services) after.services = undefined
  switch (collection) {
    case 'attendence':
      if (before) {
        before.userIds = before?.userIds?.map(mapUserIdToUserName)
        before.zeusUserIds = before?.zeusUserIds?.map(mapUserIdToUserName)
        before.promotedMembers = before?.promotedMembers?.map(mapUserIdToUserName)
      }
      if (after) {
        after.userIds = after?.userIds?.map(mapUserIdToUserName)
        after.zeusUserIds = after?.zeusUserIds?.map(mapUserIdToUserName)
        after.promotedMembers = after?.promotedMembers?.map(mapUserIdToUserName)
      }
      break
    case 'promotionSettings':
      if (before) {
        before.skills = before?.skills?.map(mapSkillIdToSkillName)
        before.optionalSkills = before?.optionalSkills?.map(mapSkillIdToSkillName)
      }
      if (after) {
        after.skills = after?.skills?.map(mapSkillIdToSkillName)
        after.optionalSkills = after?.optionalSkills?.map(mapSkillIdToSkillName)
      }
      break
    case 'recruitments':
      if (before) {
        before.referrer = mapUserIdToUserName(before?.referrer)
      }
      if (after) {
        after.referrer = mapUserIdToUserName(after?.referrer)
      }
      break
    case 'skills':
      if (before) {
        before.trainers = before?.trainers?.map(mapUserIdToUserName)
      }
      if (after) {
        after.trainers = after?.trainers?.map(mapUserIdToUserName)
      }
      break
    case 'squad':
      if (before) {
        before.squadLead = mapUserIdToUserName(before?.squadLead)
        before.squadMember = before?.squadMember?.map(mapUserIdToUserName)
      }
      if (after) {
        after.squadLead = mapUserIdToUserName(after?.squadLead)
        after.squadMember = after?.squadMember?.map(mapUserIdToUserName)
      }
      break
    case 'users':
      if (before?.profile) {
        before.profile.skills = before?.profile?.skills?.map(mapSkillIdToSkillName)
        before.profile.squad = mapSquadIdToSquadName(before?.profile?.squad)
        before.profile.squadId = mapSquadIdToSquadName(before?.profile?.squadId)
      }
      if (after?.profile) {
        after.profile.skills = after?.profile?.skills?.map(mapSkillIdToSkillName)
        after.profile.squad = mapSquadIdToSquadName(after?.profile?.squad)
        after.profile.squadId = mapSquadIdToSquadName(after?.profile?.squadId)
      }
      break
    default:
      break
  }
  return {
    ...item,
    key: item?._id,
    operation: item.key,
    before,
    after,
  }
}

const LogComponent = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])
  const [open, setOpen] = useState(false)
  const [segmentedSelection, setSegmentedSelection] = useState('changed')
  const { ready, loggings, users } = useTracker(() => {
    const handles = [
      Meteor.subscribe('users', {}),
      Meteor.subscribe('logging'),
      Meteor.subscribe('skills'),
      Meteor.subscribe('squads'),
    ]
    const dateRangeFilter = dateRange
      ? { timestamp: { $gte: dateRange[0].startOf('day').toDate(), $lte: dateRange[1].endOf('day').toDate() } }
      : {}
    const loggings = LoggingCollection.find({ ...dateRangeFilter }, { sort: { timestamp: -1 } }).map(transformLogEntry)
    return {
      ready: handles.every((h) => h.ready()),
      loggings,
      users: Meteor.users.find({}).fetch(),
    }
  }, [dateRange])
  const columns = useMemo(() => LOG_COLUMNS(users), [users])
  return (
    <Row align='middle'>
      <Col span={24}>
        <Spin spinning={!ready}>
          <Table
            scroll={{ x: 150 }}
            onRow={(record) => {
              return {
                onClick: () => {
                  const before = record?.before
                  const after = record?.after
                  const diff = diffJson(before, after)
                  setOpen(diff)
                },
              }
            }}
            title={() => (
              <Row
                justify='space-between'
                align='middle'
              >
                <Col>
                  <span
                    style={{
                      margin: '0 1.5rem 0 0',
                      padding: 0,
                      fontSize: 24,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    LOGS
                  </span>
                </Col>
                <Col>
                  <RangePicker
                    format={window.innerWidth > 700 ? 'DD.MM.YYYY' : 'DD.MM.YY'}
                    onChange={setDateRange}
                    value={dateRange}
                    placeholder={['Start', 'Ende']}
                    panelRender={window.innerWidth > 700 ? undefined : () => <></>}
                  />
                </Col>
              </Row>
            )}
            style={{ padding: '0.5rem' }}
            dataSource={loggings}
            columns={columns}
            pagination={
              loggings?.length > 10
                ? {
                    responsive: true,
                    showTotal: () => <span>{`Insgegsamt: ${loggings.length} Logs`}</span>,
                    showSizeChanger: true,
                    hideOnSinglePage: true,
                  }
                : false
            }
          />
        </Spin>
      </Col>
      {open && (
        <Modal
          open={open}
          title={'Log Detailansicht'}
          onCancel={() => setOpen(false)}
          footer={false}
          centered
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Segmented
                value={segmentedSelection}
                onChange={setSegmentedSelection}
                options={[
                  { label: 'Nur Veränderungen', value: 'changed' },
                  { label: 'Alle', value: 'all' },
                ]}
                block
              />
            </Col>
            <Col
              xs={24}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(segmentedSelection === 'all' ? open : open.filter((item) => item?.added !== item?.removed)).map(
                (part) => {
                  const color = part.added ? 'green' : part.removed ? 'red' : 'grey'
                  return (
                    <span
                      key={`part-${part.value}`}
                      style={{ color }}
                    >
                      {part.value}
                    </span>
                  )
                }
              )}
            </Col>
          </Row>
        </Modal>
      )}
    </Row>
  )
}

export default LogComponent
