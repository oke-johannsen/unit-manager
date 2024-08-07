import { Button, Col, Dropdown, Grid, List, Modal, Row, Segmented, message } from 'antd'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react'
import { RecruitmentCollection } from '../../../../api/RecruitmentsApi'
import RecruitingModal from './RecruitingModal'

const RecruitmentComponent = () => {
  const [selected, setSelected] = useState('open')
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [sortDirection, setSortDirection] = useState('desc')
  const { ready, recruitment } = useTracker(() => {
    const sub = Meteor.subscribe('users')
    const subRecruitments = Meteor.subscribe('recruitments')
    const recruitment = RecruitmentCollection.find(
      { status: selected },
      { sort: { createdAt: sortDirection === 'desc' ? -1 : 1 } }
    ).map((item) => {
      return {
        key: item?._id,
        ...item,
      }
    })
    return {
      ready: sub.ready() && subRecruitments.ready(),
      recruitment,
    }
  }, [selected, sortDirection])
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
                gutter={[10, 10]}
              >
                <Col span={breakpoints.xl ? undefined : 24}>
                  <Segmented
                    value={sortDirection}
                    onChange={setSortDirection}
                    block={!breakpoints.xl}
                    options={[
                      { value: 'desc', label: 'Absteigend' },
                      { value: 'asc', label: 'Aufsteigend' },
                    ]}
                  />
                </Col>
                <Col span={breakpoints.xl ? undefined : 24}>
                  <Segmented
                    value={selected}
                    onChange={setSelected}
                    block={!breakpoints.xl}
                    options={[
                      { value: 'open', label: 'Offen' },
                      { value: 'closed', label: 'Angenommen' },
                      { value: 'rejected', label: 'Abgelehnt' },
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
                    !breakpoints.xl
                      ? []
                      : [
                          <Dropdown
                            key='actions-dropdown'
                            menu={{
                              items: [
                                ...(selected === 'open'
                                  ? [
                                      { key: 'close', label: 'Annehmen' },
                                      { key: 'rejected', label: 'Ablehnen', danger: true },
                                    ]
                                  : [{ key: 'open', label: 'Wiedereröffnen' }]),
                                { type: 'divider' },
                                { key: 'edit', label: 'Bearbeiten' },
                                { key: 'delete', label: 'Löschen', danger: true },
                              ],
                              onClick: ({ key }) => {
                                if (key === 'delete') {
                                  setDeleteModal(true)
                                } else if (key === 'edit') {
                                  setEditModal(item)
                                } else {
                                  Meteor.call(
                                    'recruitment.update',
                                    item.key,
                                    {
                                      status: key,
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
                      <Row
                        gutter={[8, 8]}
                        style={{ width: '100%', flexWrap: !breakpoints.xl ? 'wrap' : 'nowrap' }}
                      >
                        <Col span={breakpoints.xl ? 15 : 24}>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>Alter:</Col>
                            <Col flex='auto'>{item.age}</Col>
                          </Row>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>Discord:</Col>
                            <Col flex='auto'>{item.discordId}</Col>
                          </Row>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>Steam:</Col>
                            <Col
                              flex='auto'
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
                          </Row>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>Stunden:</Col>
                            <Col flex='auto'>{item.amountOfHours}</Col>
                          </Row>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>Anwesenheit:</Col>
                            <Col flex='auto'>{item.attendenceBehaviour}</Col>
                          </Row>
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col>MilSim Erfahrung:</Col>
                            <Col
                              flex='auto'
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {item.experience}
                            </Col>
                          </Row>
                          {item.referred && (
                            <Row
                              gutter={[8, 8]}
                              style={{ width: '100%' }}
                            >
                              <Col>Rekrutiert durch:</Col>
                              <Col flex='auto'>{Meteor.users.findOne(item.referrer)?.profile?.name}</Col>
                            </Row>
                          )}
                          {item.createdAt && (
                            <Row
                              gutter={[8, 8]}
                              style={{ width: '100%' }}
                            >
                              <Col>Datum:</Col>
                              <Col flex='auto'>
                                {new Date(item.createdAt).toLocaleDateString('de-DE', {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric',
                                })}
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col
                          flex='auto'
                          style={{
                            borderRadius: '8px',
                            paddingLeft: '2rem',
                            paddingTop: '1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                          }}
                        >
                          <Row
                            gutter={[8, 8]}
                            style={{ width: '100%' }}
                          >
                            <Col span={24}>
                              <b>Notizen:</b>
                            </Col>
                            <Col
                              flex='auto'
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {item.description}
                            </Col>
                          </Row>
                        </Col>
                        {!breakpoints.xl && (
                          <Col span={24}>
                            <Row
                              gutter={[8, 8]}
                              justify='end'
                            >
                              <Dropdown
                                key='actions-dropdown'
                                menu={{
                                  items: [
                                    ...(selected === 'open'
                                      ? [
                                          { key: 'close', label: 'Annehmen' },
                                          { key: 'rejected', label: 'Ablehnen', danger: true },
                                        ]
                                      : [{ key: 'open', label: 'Wiedereröffnen' }]),
                                    { type: 'divider' },
                                    { key: 'edit', label: 'Bearbeiten' },
                                    { key: 'delete', label: 'Löschen', danger: true },
                                  ],
                                  onClick: ({ key }) => {
                                    if (key === 'delete') {
                                      setDeleteModal(true)
                                    } else if (key === 'edit') {
                                      setEditModal(item)
                                    } else {
                                      Meteor.call(
                                        'recruitment.update',
                                        item.key,
                                        {
                                          status: key,
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
