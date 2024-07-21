import { AppstoreFilled, EditFilled } from '@ant-design/icons'
import { Col, Modal, Row, Segmented, Tabs } from 'antd'
import { Meteor } from 'meteor/meteor'
import React from 'react'
import UserDashboardComponent from './UserDashboardComponent'

const UserDisplayModal = ({ openUserDisplayModal, setOpenUserDisplayModal, switchModal }) => {
  return (
    <Modal
      open={openUserDisplayModal}
      onCancel={() => setOpenUserDisplayModal(false)}
      width={'85vw'}
      footer={false}
      title={
        Meteor.user()?.profile?.securityClearance > 1 ? (
          <Row
            style={{ width: 'calc(100% - 20px)' }}
            gutter={[8, 8]}
            justify='space-between'
            align='middle'
          >
            <Col>Mitglieder anzeigen</Col>
            <Col>
              <Segmented
                defaultValue='Dashboard'
                options={[
                  { label: <EditFilled />, value: 'Formular' },
                  { label: <AppstoreFilled style={{ color: '#5f1d1d' }} />, value: 'Dashboard' },
                ]}
                onChange={switchModal}
              />
            </Col>
          </Row>
        ) : (
          'Mitglieder anzeigen'
        )
      }
      centered
    >
      <Tabs
        items={
          openUserDisplayModal &&
          openUserDisplayModal.map((userId) => {
            const user = Meteor.users.findOne(userId)
            return {
              key: userId,
              label: user?.profile?.name,
              children: <UserDashboardComponent userProp={user} />,
            }
          })
        }
      />
    </Modal>
  )
}

export default UserDisplayModal
