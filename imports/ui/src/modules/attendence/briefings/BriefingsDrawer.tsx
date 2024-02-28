import { Badge, Col, Divider, Drawer, Row, Tabs, Typography } from 'antd'
import React from 'react'
import { AttendenceCollection } from '../../../../../api/AttendenceApi'
import { Meteor } from 'meteor/meteor'
import { troops } from './helpers/troops.lib'

const BriefingsDrawer = ({
  open = false,
  setOpen = (value: boolean) => {
    console.warn('setOpen', value)
  },
  data = {} as any,
  setData = (value: any) => {
    console.warn('setData', value)
  },
}) => {
  const handleCancel = () => {
    setOpen(false)
    setData({})
  }

  return (
    <Drawer
      open={open}
      title={AttendenceCollection.findOne({ _id: data?.attendenceId ?? null })?.title}
      onClose={handleCancel}
      width={600}
    >
      <DrawerContent data={data} />
    </Drawer>
  )
}

interface DawerContentData {
  attendenceId: string
  civilSituation: string
  enemySituation: string
  friendlySituation: string
  geoSituation: string
  leadershipSupport: string
  ramification: string
  support: string
  orders: string
  execution: string
  attendees: Array<string>
}

const DrawerContent = ({ data = {} as DawerContentData }) => {
  const {
    civilSituation,
    enemySituation,
    friendlySituation,
    geoSituation,
    leadershipSupport,
    ramification,
    support,
    orders,
    execution,
    attendees,
  } = data
  const troopAssignments = troops
    ?.map(({ nodes }) => ({
      ...nodes.map(({ key, callsign }) => ({
        key,
        callsign,
        value: Meteor.users.findOne({ _id: data[key] ?? null })?.profile?.name,
      })),
    }))
    .flat()
  const attendeesNames = attendees?.map((userId: string) => Meteor.users.findOne({ _id: userId })?.profile?.name)
  return (
    <Row>
      <Col span={24}>
        <Tabs
          defaultActiveKey='1'
          items={[
            {
              label: 'Befehlsausgabe',
              key: '1',
              children: (
                <Row style={{ flexDirection: 'column', gap: '0.5rem' }}>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Rahmenlage</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {ramification}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Lage Feind</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {enemySituation}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Lage Eigen</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {friendlySituation}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Lage Zivil</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {civilSituation}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Lage GEO</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {geoSituation}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Auftrag</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {orders}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>Durchführung</Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {execution}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>
                    Einsatzunterstützung
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {support}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>
                    Führungsunterstützung
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {leadershipSupport}
                  </Typography.Text>
                </Row>
              ),
            },
            {
              label: 'Zuteilung',
              key: '2',
              children: (
                <Row style={{ gap: '0.5rem' }}>
                  <Col span={24}>
                    <Row gutter={[16, 16]}>
                      {troopAssignments?.map((nodes: any, index) => {
                        return (
                          <Col
                            span={24}
                            key={'nodes' + index}
                          >
                            <Row gutter={[8, 8]}>
                              {Object.values(nodes)?.map((item: any) => (
                                <Col
                                  md={24}
                                  lg={12}
                                  key={item.key}
                                >
                                  <Row>
                                    <Col span={24}>
                                      <Typography.Text style={{ color: '#5f1d1d', fontWeight: 'bold' }}>
                                        {item.callsign}
                                      </Typography.Text>
                                    </Col>
                                    <Col span={24}>
                                      <Typography.Text
                                        type={attendeesNames?.includes(item.value) ? 'success' : 'secondary'}
                                        style={{ whiteSpace: 'pre-wrap' }}
                                      >
                                        {item.value}
                                      </Typography.Text>
                                    </Col>
                                  </Row>
                                </Col>
                              ))}
                            </Row>
                            {index < troopAssignments?.length - 1 && <Divider />}
                          </Col>
                        )
                      })}
                    </Row>
                  </Col>
                </Row>
              ),
            },
            {
              label: (
                <Badge
                  color={'#5f1d1d'}
                  count={attendees?.length}
                  offset={[10, -5]}
                  size='small'
                >
                  Teilnehmer
                </Badge>
              ),
              key: '3',
              children: (
                <Row style={{ gap: '0.5rem' }}>
                  <Col span={24}>
                    <Typography.Text>{attendeesNames?.join(', ')}</Typography.Text>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  )
}

export default BriefingsDrawer
