import { Col, List, Modal, Row, Tabs, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { SquadCollection } from '../../../../api/SquadApi'
import SquadForm from './SquadForm'
import { Meteor } from 'meteor/meteor'

const SquadModal = ({ open, setOpen, ids, title, formDisabled, isDelete, isDisplay }) => {
  const [forms, setForms] = useState({})
  const [form, setForm] = useState(undefined)
  const [activeKey, setActiveKey] = useState(null)
  useEffect(() => {
    if (ids?.length) {
      setActiveKey(ids[0])
    } else {
      setActiveKey(null)
    }
  }, [ids])
  const handleSubmit = () => {
    if (ids?.length) {
      ids.forEach((id, index) => {
        if (isDelete) {
          Meteor.call('squad.remove', id, (err, res) => {
            if (!err) {
              if (index === ids.length - 1) {
                setForm(undefined)
                setForms({})
                message.success('Trupps wurden erfolgreich gelöscht!')
                setOpen(false)
              }
            } else {
              message.error('Etwas ist schief gelaufen, bitte versuche es erneut!')
              console.error(err, res)
            }
          })
        } else {
          if (forms[id]) {
            Meteor.call('squad.update', id, forms[id], (err, res) => {
              if (!err) {
                if (index === ids.length - 1) {
                  setForm(undefined)
                  setForms({})
                  message.success('Trupps wurden erfolgreich erstellt!')
                  setOpen(false)
                }
              } else {
                message.error('Etwas ist schief gelaufen, bitte versuche es erneut!')
                console.error(err, res)
              }
            })
          }
        }
      })
    } else {
      Meteor.call('squad.create', form, (err, res) => {
        if (!err) {
          setForm(undefined)
          setForms({})
          message.success('Trupp wurde erfolgreich erstellt!')
          setOpen(false)
        } else {
          message.error('Etwas ist schief gelaufen, bitte versuche es erneut!')
          console.error(err, res)
        }
      })
    }
  }
  const handleFormChange = (payload) => {
    if (ids?.length) {
      const formsCopy = { ...forms }
      formsCopy[activeKey] = payload
      setForms(formsCopy)
    } else {
      setForm(payload)
    }
  }
  const getPositions = (squadMember = []) => {
    const squadPositions = [
      { postion: 1, userName: 'Nicht besetzt' },
      { postion: 2, userName: 'Nicht besetzt' },
      { postion: 3, userName: 'Nicht besetzt' },
      { postion: 4, userName: 'Nicht besetzt' },
      { postion: 5, userName: 'Nicht besetzt' },
      { postion: 6, userName: 'Nicht besetzt' },
      { postion: 'Straps', usersNames: [] },
    ]
    squadMember.forEach((id) => {
      const profile = Meteor.users.findOne(id)?.profile
      switch (profile?.squadPosition) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          squadPositions[profile?.squadPosition - 1].userName = profile?.name
          break
        default:
          squadPositions[6].usersNames.push(profile?.name)
          break
      }
    })
    if (squadPositions[6].usersNames.length === 0) {
      squadPositions.splice(6, 1)
    }
    if (
      squadPositions[0].userName === 'Nicht besetzt' &&
      squadPositions[1].userName === 'Nicht besetzt' &&
      squadPositions[2].userName === 'Nicht besetzt' &&
      squadPositions[3].userName === 'Nicht besetzt' &&
      squadPositions[4].userName === 'Nicht besetzt' &&
      squadPositions[5].userName === 'Nicht besetzt'
    ) {
      squadPositions.splice(0, 6)
    }
    return squadPositions
  }
  const getModalContent = () => {
    let body
    if (ids?.length) {
      if (isDelete) {
        body = (
          <Row>
            <Col>
              Bist du sicher, dass du {ids.length} {ids.length === 1 ? 'Trupp' : 'Trupps'} löschen möchtest?
            </Col>
            <List
              dataSource={SquadCollection.find({ _id: { $in: ids } }).fetch()}
              style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
              renderItem={(item) => {
                const squad = SquadCollection.findOne(item)
                return (
                  <Row style={{ width: '100%' }}>
                    <Col
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={4}
                      xxl={4}
                    >
                      {squad?.squadName}:
                    </Col>
                    <Col flex='auto'>
                      {squad?.squadMember?.length} {squad?.squadMember?.length === 1 ? 'Mitglied' : 'Mitglieder'}
                    </Col>
                  </Row>
                )
              }}
            />
          </Row>
        )
      } else {
        body = (
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={ids?.map((id) => {
              const squad = SquadCollection.findOne(id)
              const postions = getPositions(squad?.squadMember)
              return {
                key: id,
                label: squad?.squadName,
                children: isDisplay ? (
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Row gutter={[8, 8]}>
                        <Col span={24}>
                          <b>Spezialisierung:</b>
                        </Col>
                        <Col span={24}>{squad?.speciality}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={[8, 8]}>
                        <Col span={24}>
                          <b>Zugehörigkeit:</b>
                        </Col>
                        <Col span={24}>{squad?.designation}</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row gutter={[8, 8]}>
                        <Col span={24}>
                          <b>Mitglieder:</b>
                        </Col>
                        <Col span={24}>
                          <Row gutter={[8, 8]}>
                            {postions.map((postion) => {
                              return (
                                <Col
                                  span={24}
                                  key={'position-' + postion.postion}
                                >
                                  {postion.postion}: {postion.userName || postion.usersNames.join(', ')}
                                </Col>
                              )
                            })}
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <SquadForm
                    id={id}
                    handleFormChange={handleFormChange}
                    handleSubmit={handleSubmit}
                    formDisabled={formDisabled}
                  />
                ),
              }
            })}
          />
        )
      }
    } else {
      body = (
        <SquadForm
          handleFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      )
    }
    return body
  }
  return (
    <Modal
      open={open}
      title={title}
      okText={isDelete ? 'Löschen' : 'Speichern'}
      okButtonProps={{
        danger: isDelete,
      }}
      onOk={handleSubmit}
      cancelText='Abbrechen'
      onCancel={() => setOpen(false)}
      footer={formDisabled ? false : undefined}
      centered
      destroyOnClose
    >
      {getModalContent()}
    </Modal>
  )
}

export default SquadModal
