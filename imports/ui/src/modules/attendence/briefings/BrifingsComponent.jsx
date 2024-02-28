import React, { useMemo, useState } from 'react'
import { Table, Button, Row, Col } from 'antd'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { BriefingCollection } from '../../../../../api/BriefingsApi'
import BRIEFINGS_TABLE_COLUMNS from './helpers/BRIIEFINGS_TABLE_COLUMNS'
import BriefingModal from './helpers/BriefingModal'

const BriefingsComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const securityClearance = useMemo(() => Meteor.user()?.profile?.securityClearance, [])
  const briefings = useTracker(() => {
    return BriefingCollection.find({}).map((b) => ({ key: b._id, ...b }))
  }, [])

  return (
    <Row
      key='briefings'
      gutter={[16, 16]}
      justify='end'
    >
      {securityClearance > 2 && (
        <Col>
          <Button
            type='primary'
            onClick={() => setIsModalVisible(true)}
          >
            Briefing erstellen
          </Button>
        </Col>
      )}
      <Col span={24}>
        <Table
          dataSource={briefings}
          columns={BRIEFINGS_TABLE_COLUMNS}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          onRow={(record) => {
            return {
              onClick: () => setIsModalVisible(record),
            }
          }}
        />
      </Col>
      <BriefingModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
    </Row>
  )
}

export default BriefingsComponent
