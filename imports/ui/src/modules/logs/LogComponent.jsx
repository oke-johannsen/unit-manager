import { Col, DatePicker, Modal, Row, Segmented, Spin, Table } from 'antd'
import dayjs from 'dayjs'
import { diffJson } from 'diff'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react'
import { LoggingCollection } from '../../../../api/LoggingApi'
import { LOG_COLUMNS } from './LOG_COLUMNS'
const { RangePicker } = DatePicker

const LogComponent = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])
  const [open, setOpen] = useState(false)
  const [segmentedSelection, setSegmentedSelection] = useState('all')
  const { ready, loggings } = useTracker(() => {
    const sub = Meteor.subscribe('users', {})
    const subLogging = Meteor.subscribe('logging')
    const loggings = LoggingCollection.find(
      dateRange
        ? {
            timestamp: {
              $gte: dateRange[0].startOf('day').toDate(),
              $lte: dateRange[1].endOf('day').toDate(),
            },
          }
        : {},
      { sort: { timestamp: -1 } }
    ).map((item) => {
      return {
        ...item,
        key: item?._id,
        operation: item.key,
      }
    })
    return {
      ready: sub.ready() && subLogging.ready(),
      loggings,
    }
  }, [dateRange])
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
                  if (before?._id) before._id = undefined
                  if (before?.createdAt) before.createdAt = undefined
                  if (before?.services) before.services = undefined
                  const after = record?.after?.modifier ?? record?.after
                  if (after?._id) after._id = undefined
                  if (after?.createdAt) after.createdAt = undefined
                  if (after?.services) after.services = undefined
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
            columns={LOG_COLUMNS}
            pagination={
              loggings?.length > 10
                ? {
                    responsive: true,
                    showTotal: (data) => <span>{`Insgegsamt: ${data.length} Logs`}</span>,
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
                  { label: 'Alle', value: 'all' },
                  { label: 'Nur Veränderungen', value: 'changed' },
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
