import { AppstoreFilled, EditFilled } from '@ant-design/icons'
import { Col, Modal, Row, Segmented, Tabs, message } from 'antd'
import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import UserForm from './UserForm'

const UserUpdateModal = ({ openUserUpdateModal, setOpenUserUpdateModal, switchModal }) => {
  const [forms, setForms] = useState({})
  const submitForms = () => {
    let error = false
    Object.values(forms).forEach((values, index) => {
      const user = Meteor.users.findOne(Object.keys(forms)[index])
      if (user) {
        const profileData = {
          ...user.profile,
          name: values.name,
          tier: values.tier,
          designation: values.designation,
          rank: values.rank,
          squad: values.squad,
          squadPosition: values.squadPosition,
          securityClearance: values.securityClearance,
          points: values.points,
          inactivityPoints: values.inactivityPoints,
          skills: values.skills,
        }
        const payload = {
          ...user,
          username: values.username || user.username,
          createdAt: dayjs(values.createdAt).toDate(),
          profile: profileData,
          _id: Object.keys(forms)[index],
        }
        Meteor.call(`users.update`, payload, (err, res) => {
          if (!err) {
            setOpenUserUpdateModal(false)
          } else {
            error = false
            console.error(`Error in users.update`, err, res)
          }
        })
      }
    })
    if (!error) {
      message.success(`Mitglieder erfolgreich aktualisiert!`)
    } else {
      message.error(`Aktualisieren von Mitgliedern fehlgeschlagen!`)
    }
  }
  return (
    <Modal
      title={
        Meteor.user()?.profile?.securityClearance > 1 ? (
          <Row
            style={{ width: 'calc(100% - 20px)' }}
            gutter={[8, 8]}
            justify='space-between'
            align='middle'
          >
            <Col>Mitglieder bearbeiten</Col>
            <Col>
              <Segmented
                defaultValue='Formular'
                options={[
                  { label: <EditFilled style={{ color: '#5f1d1d' }} />, value: 'Formular' },
                  { label: <AppstoreFilled />, value: 'Dashboard' },
                ]}
                onChange={switchModal}
              />
            </Col>
          </Row>
        ) : (
          'Mitglieder bearbeiten'
        )
      }
      open={openUserUpdateModal}
      onCancel={() => setOpenUserUpdateModal(false)}
      footer={false}
      centered
      destroyOnClose
    >
      {openUserUpdateModal?.length > 1 ? (
        <Tabs
          items={
            openUserUpdateModal &&
            openUserUpdateModal?.map((userId) => {
              return {
                key: userId,
                label: Meteor.users.findOne(userId)?.profile?.name,
                children: (
                  <UserForm
                    userId={userId}
                    closeModal={() => setOpenUserUpdateModal(false)}
                    forms={forms}
                    setForms={setForms}
                    submitForms={submitForms}
                  />
                ),
              }
            })
          }
        />
      ) : (
        <UserForm
          userId={openUserUpdateModal[0]}
          closeModal={() => setOpenUserUpdateModal(false)}
          forms={forms}
          setForms={setForms}
          submitForms={submitForms}
        />
      )}
    </Modal>
  )
}

export default UserUpdateModal
