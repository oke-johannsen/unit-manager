import { Col, List, Modal, Row } from 'antd'
import React from 'react'
import { Meteor } from 'meteor/meteor'
import UserList from './UserList'

const UserArchiveModal = ({ openUserArchiveModal, setOpenUserArchiveModal }) => {
  const archiveUsers = () => {
    if (openUserArchiveModal?.length) {
      let error = false
      openUserArchiveModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId)
        if (user) {
          const data = {
            ...user,
            profile: {
              ...(user.profile || {}),
              status: 'inactive',
            },
          }
          Meteor.call('users.update', data, (err, res) => {
            if (err) {
              error = true
            }
          })
        }
      })
      setOpenUserArchiveModal(false)
      if (!error) {
        message.success(`Mitglieder erfolgreich deaktiviert!`)
      } else {
        message.error(`Deaktivieren von Mitgliedern fehlgeschlagen!`)
      }
    }
  }
  return (
    <Modal
      open={openUserArchiveModal}
      onCancel={() => setOpenUserArchiveModal(false)}
      onOk={archiveUsers}
      cancelText='Abbrechen'
      title='Mitglieder auf inaktiv setzen'
      centered
    >
      <Row>
        <Col>
          Bist du sicher, dass du {openUserArchiveModal && openUserArchiveModal.length}{' '}
          {openUserArchiveModal.length === 1 ? 'Mitglied' : 'Mitglieder'} auf inaktiv setzen möchtest?
        </Col>
        <UserList dataSource={openUserArchiveModal} />
      </Row>
    </Modal>
  )
}

export default UserArchiveModal
