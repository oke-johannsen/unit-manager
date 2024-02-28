import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { LoggingCollection } from '../../../../api/LoggingApi'
import { Col, DatePicker, Modal, Row, Spin, Table } from 'antd'
import { LOG_COLUMNS } from './LOG_COLUMNS'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

const LogComponent = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])
  const [open, setOpen] = useState(false)
  const { ready, loggings } = useTracker(() => {
    const sub = Meteor.subscribe('users')
    const subLogging = Meteor.subscribe('logging')
    const loggings = LoggingCollection.find(
      dateRange
        ? {
            timestamp: {
              $gte: dateRange[0].toDate(),
              $lte: dateRange[1].toDate(),
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
                  setOpen(record)
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
                    showTotal: () => <span>{`Insgegsamt: ${data.length} Logs`}</span>,
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
            <Col
              xs={24}
              xl={12}
            >
              <Row>
                <Col
                  span={24}
                  style={{ fontWeight: 'bold' }}
                >
                  Vorher
                </Col>
                <Col
                  span={24}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {JSON.stringify(open.before, null, 2)}
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              xl={12}
            >
              <Row>
                <Col
                  span={24}
                  style={{ fontWeight: 'bold' }}
                >
                  Nachher
                </Col>
                <Col
                  span={24}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {JSON.stringify(open.after, null, 2)}
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      )}
    </Row>
  )
}

export default LogComponent
