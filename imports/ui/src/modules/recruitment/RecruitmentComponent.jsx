import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Segmented,
  Select,
  Switch,
  Tooltip,
  message,
} from 'antd'
import { RecruitmentCollection } from '../../../../api/RecruitmentsApi'
import { InfoCircleOutlined } from '@ant-design/icons'
import RecruitingModal from './RecruitingModal'
import { values } from '@babel/runtime/regenerator'

const RecruitmentComponent = () => {
  const [selected, setSelected] = useState('open')
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const { ready, recruitment } = useTracker(() => {
    const sub = Meteor.subscribe('users')
    const subRecruitments = Meteor.subscribe('recruitments')
    const recruitment = RecruitmentCollection.find({ status: selected }).map((item) => {
      return {
        key: item?._id,
        ...item,
      }
    })
    return {
      ready: sub.ready() && subRecruitments.ready(),
      recruitment,
    }
  }, [selected])
  const breakpoints = Grid.useBreakpoint()
  return (
    <>
      <List
        className='recruitment-list'
        header={
          <Row
            justify='space-between'
            align='middle'
          >
            <Col>
              <span style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}>Bewerbungen</span>
            </Col>
            <Col>
              <Row
                align='middle'
                gutter={16}
              >
                <Col>
                  <Segmented
                    value={selected}
                    onChange={setSelected}
                    options={[
                      { value: 'open', label: 'Offen' },
                      { value: 'closed', label: 'Abgeschlossen' },
                    ]}
                  />
                </Col>
                <Col>Anzahl: {recruitment?.length || 0}</Col>
              </Row>
            </Col>
          </Row>
        }
        loading={!ready}
        dataSource={recruitment || []}
        renderItem={(item) => {
          return (
            <Row key={item.key}>
              <Col span={24}>
                <List.Item
                  actions={
                    !breakpoints.lg
                      ? []
                      : [
                          <Dropdown
                            key='actions-dropdown'
                            menu={{
                              items: [
                                {
                                  key: selected === 'open' ? 'close' : 'open',
                                  label: selected === 'open' ? 'Abschließen' : 'Wiedereröffnen',
                                },
                                { key: 'edit', label: 'Bearbeiten' },
                                { key: 'delete', label: 'Löschen', danger: true },
                              ],
                              onClick: ({ key }) => {
                                if (key === 'delete') {
                                  setDeleteModal(true)
                                } else if (key === 'edit') {
                                  setEditModal(item)
                                } else if (key === 'close' || key === 'open') {
                                  Meteor.call(
                                    'recruitment.update',
                                    item.key,
                                    {
                                      status: item.status === 'open' ? 'closed' : 'open',
                                    },
                                    (err, res) => {
                                      if (!err) {
                                        message.success('Bewerbung erfolgreich verschoben!')
                                      } else {
                                        console.error('error in recruitment.remove', err, res)
                                        message.error('Es was ist schief gelaufen, bitte versuche es erneut!')
                                      }
                                    }
                                  )
                                }
                              },
                            }}
                          >
                            <Button>Aktionen</Button>
                          </Dropdown>,
                        ]
                  }
                >
                  <List.Item.Meta
                    title={item.preferredName}
                    description={
                      <Row style={{ width: '100%' }}>
                        <Col span={!breakpoints.lg ? 24 : 8}>Alter:</Col>
                        <Col span={!breakpoints.lg ? 24 : 16}>{item.age}</Col>
                        <Col span={!breakpoints.lg ? 24 : 8}>Discord:</Col>
                        <Col span={!breakpoints.lg ? 24 : 16}>{item.discordId}</Col>
                        <Col span={!breakpoints.lg ? 24 : 8}>Steam:</Col>
                        <Col
                          span={!breakpoints.lg ? 24 : 16}
                          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                        >
                          <a
                            href={item.steamProfile}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {item.steamProfile}
                          </a>
                        </Col>
                        <Col span={!breakpoints.lg ? 24 : 8}>Stunden:</Col>
                        <Col span={!breakpoints.lg ? 24 : 16}>{item.amountOfHours}</Col>
                        <Col span={!breakpoints.lg ? 24 : 8}>Anwesenheit:</Col>
                        <Col span={!breakpoints.lg ? 24 : 16}>{item.attendenceBehaviour}</Col>
                        <Col span={!breakpoints.lg ? 24 : 8}>MilSim Erfahrung:</Col>
                        <Col
                          span={!breakpoints.lg ? 24 : 16}
                          style={{ whiteSpace: 'pre-wrap' }}
                        >
                          {item.experience}
                        </Col>
                        {item.referred && (
                          <>
                            <Col span={!breakpoints.lg ? 24 : 8}>Rekrutiert durch:</Col>
                            <Col span={!breakpoints.lg ? 24 : 16}>
                              {Meteor.users.findOne(item.referrer)?.profile?.name}
                            </Col>
                          </>
                        )}
                        {!breakpoints.lg && (
                          <Col span={24}>
                            <Row
                              gutter={[8, 8]}
                              justify='end'
                            >
                              <Dropdown
                                key='actions-dropdown'
                                menu={{
                                  items: [
                                    {
                                      key: selected === 'open' ? 'close' : 'open',
                                      label: selected === 'open' ? 'Abschließen' : 'Wiedereröffnen',
                                    },
                                    { key: 'edit', label: 'Bearbeiten' },
                                    { key: 'delete', label: 'Löschen', danger: true },
                                  ],
                                  onClick: ({ key }) => {
                                    if (key === 'delete') {
                                      setDeleteModal(true)
                                    } else if (key === 'edit') {
                                      setEditModal(item)
                                    } else if (key === 'close' || key === 'open') {
                                      Meteor.call(
                                        'recruitment.update',
                                        item.key,
                                        {
                                          status: item.status === 'open' ? 'closed' : 'open',
                                        },
                                        (err, res) => {
                                          if (!err) {
                                            message.success('Bewerbung erfolgreich verschoben!')
                                          } else {
                                            console.error('error in recruitment.remove', err, res)
                                            message.error('Es was ist schief gelaufen, bitte versuche es erneut!')
                                          }
                                        }
                                      )
                                    }
                                  },
                                }}
                              >
                                <Button>Aktionen</Button>
                              </Dropdown>
                            </Row>
                          </Col>
                        )}
                      </Row>
                    }
                  />
                </List.Item>
              </Col>
            </Row>
          )
        }}
        style={{ margin: '2rem' }}
        bordered
      />
      {deleteModal && (
        <Modal
          open={deleteModal}
          title='Bewerbung löschen'
          okText='Löschen'
          okButtonProps={{ danger: true }}
          onOk={() => {
            Meteor.call('recruitment.remove', deleteModal?.key, (err, res) => {
              if (!err) {
                message.success('Bewerbung erfolgreich gelöscht!')
                setDeleteModal(false)
              } else {
                console.error('error in recruitment.remove', err, res)
                message.error('Es was ist schief gelaufen, bitte versuche es erneut!')
              }
            })
          }}
          cancelText='Abbrechen'
          onCancel={() => setDeleteModal(false)}
          centered
        >
          Bist du sicher, dass du diese Bewerbung löschen möchtest?
        </Modal>
      )}
      {editModal && (
        <RecruitingModal
          open={editModal}
          setOpen={setEditModal}
          finishHandler={(values) => {
            Meteor.call('recruitment.update', editModal?.key, values, (err, res) => {
              if (!err) {
                message.success('Bewerbung erfolgreich aktualisiert!')
                setEditModal(false)
              } else {
                console.error('error in recruitment.update', err, res)
                message.error('Es was ist schief gelaufen, bitte versuche es erneut!')
              }
            })
          }}
        />
      )}
    </>
  )
}

export default RecruitmentComponent
