import {
  Badge,
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Row,
  Segmented,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd'
import React, { Suspense, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { MEMBER_TABLE_COLUMNS } from './MEMBER_TABLE_COLUMNS'
import UserCreateModal from './UserCreateModal'
import UserUpdateModal from './UserUpdateModal'
import UserDisplayModal from './UserDisplayModal'
import UserArchiveModal from './UsersArchiveModal'
import UserReactivateModal from './UserReactiveModal'
import UserDeleteModal from './UserDeleteModal'
import PasswordResetModal from '../../layout/common/PasswordResetModal'
import { ranks, sortByRank } from '../../libs/SORTER_LIB'
import { PromotionSettingsCollection } from '../../../../api/PromotionSettingsApi'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { AttendenceCollection } from '../../../../api/AttendenceApi'

function generateGradientColors(startColor, endColor, steps) {
  const start = hexToRgb(startColor)
  const end = hexToRgb(endColor)

  const step = {
    r: (end.r - start.r) / steps,
    g: (end.g - start.g) / steps,
    b: (end.b - start.b) / steps,
  }

  const colors = []

  for (let i = 0; i <= steps; i++) {
    const r = Math.round(start.r + step.r * i)
    const g = Math.round(start.g + step.g * i)
    const b = Math.round(start.b + step.b * i)

    colors.push(rgbToHex(r, g, b))
  }

  return colors
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const MembersTable = ({ props }) => {
  const {
    data,
    options,
    selected,
    setSelected,
    setOpenUserCreateModal,
    setOpenUserUpdateModal,
    setOpenUserDisplayModal,
    setOpenUserArchiveModal,
    setOpenUserReactivateModal,
    setOpenUserDeleteModal,
    setOpenPasswordResetModal,
    rowSelection,
    setRowSelection,
    search,
    setSearch,
    securityClearance,
    items,
    openUserCreateModal,
    openUserUpdateModal,
    openUserDisplayModal,
    openUserArchiveModal,
    openUserReactivateModal,
    openUserDeleteModal,
    openPasswordResetModal,
  } = props
  return (
    <Col span={24}>
      <Table
        scroll={{ x: 150 }}
        title={() => (
          <Row
            gutter={[16, 16]}
            justify='space-between'
            align='middle'
          >
            <Col flex='auto'>
              <Row
                gutter={[16, 16]}
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
                    Mitgliederliste
                  </span>
                </Col>
                <Col
                  style={{
                    width: window.innerWidth < 768 ? '100%' : 'initial',
                  }}
                >
                  <Segmented
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    block={window.innerWidth < 768}
                  />
                </Col>
                {window.innerWidth > 700 && (
                  <Col>
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder='Mitglieder suchen'
                    />
                  </Col>
                )}
              </Row>
            </Col>
            {securityClearance > 1 && (
              <Col>
                {securityClearance < 3 ? (
                  <Dropdown.Button
                    type='primary'
                    menu={{
                      items,
                    }}
                  >
                    Aktionen
                  </Dropdown.Button>
                ) : (
                  <Dropdown.Button
                    type='primary'
                    onClick={() => setOpenUserCreateModal(true)}
                    menu={{
                      items,
                    }}
                  >
                    Erstellen
                  </Dropdown.Button>
                )}
              </Col>
            )}
          </Row>
        )}
        columns={MEMBER_TABLE_COLUMNS}
        dataSource={data}
        pagination={
          data?.length > 7
            ? {
                pageSize: 7,
                responsive: true,
                showSizeChanger: false,
              }
            : false
        }
        loading={!data?.length == null}
        style={{
          padding: '0.5rem',
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (securityClearance === 1) {
                setOpenUserDisplayModal([record._id])
              } else {
                setOpenUserUpdateModal([record._id])
              }
            },
          }
        }}
        rowSelection={
          securityClearance > 1
            ? {
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  setRowSelection({ selectedRows, selectedRowKeys })
                },
                selectedRowKeys: rowSelection?.selectedRowKeys || [],
              }
            : false
        }
      />
      {openUserCreateModal && (
        <UserCreateModal
          openUserCreateModal={openUserCreateModal}
          setOpenUserCreateModal={setOpenUserCreateModal}
        />
      )}
      {openUserUpdateModal && (
        <UserUpdateModal
          openUserUpdateModal={openUserUpdateModal}
          setOpenUserUpdateModal={setOpenUserUpdateModal}
        />
      )}
      {openUserDisplayModal && (
        <UserDisplayModal
          openUserDisplayModal={openUserDisplayModal}
          setOpenUserDisplayModal={setOpenUserDisplayModal}
        />
      )}
      {openUserArchiveModal && (
        <UserArchiveModal
          openUserArchiveModal={openUserArchiveModal}
          setOpenUserArchiveModal={setOpenUserArchiveModal}
        />
      )}
      {openUserReactivateModal && (
        <UserReactivateModal
          openUserReactivateModal={openUserReactivateModal}
          setOpenUserReactivateModal={setOpenUserReactivateModal}
        />
      )}
      {openUserDeleteModal && (
        <UserDeleteModal
          openUserDeleteModal={openUserDeleteModal}
          setOpenUserDeleteModal={setOpenUserDeleteModal}
        />
      )}
      {openPasswordResetModal && (
        <PasswordResetModal
          open={openPasswordResetModal}
          setOpen={setOpenPasswordResetModal}
          userId={rowSelection?.selectedRowKeys[0]}
        />
      )}
    </Col>
  )
}

const rankOptions = ranks.map((rank) => ({
  value: rank,
  label: rank,
}))

const PromotionSettingsForm = ({ openForm, setOpenForm, skills }) => {
  const skillsOptions = skills
    ? skills?.map((skill) => ({
        value: skill._id,
        label: (
          <span>
            <Badge color={skill.color || '#ccc'} /> {skill.name ?? 'Kein Rang'}
          </span>
        ),
        name: skill.name,
        color: skill.color || '#ccc',
      }))
    : []

  const tagRender = (item) => {
    const skill = skillsOptions?.filter((option) => option.value === item.value)[0]
    return skill ? (
      <Tag
        style={{ margin: '0.2rem' }}
        color={skill?.color}
        value={skill?.value}
      >
        {skill?.name ?? 'Kein Rang'}
      </Tag>
    ) : (
      item?.value
    )
  }

  const handleClose = () => {
    setOpenForm(false)
  }

  const handleError = (error) => {
    console.error(error)
  }

  const handleFinish = (values) => {
    if (openForm?._id) {
      Meteor.call('promotionSettings.update', openForm._id, values, (error) => {
        if (error) {
          handleError(error)
        } else {
          handleClose()
        }
      })
    } else {
      Meteor.call('promotionSettings.create', values, (error) => {
        if (error) {
          handleError(error)
        } else {
          handleClose()
        }
      })
    }
  }

  const handleDelete = () => {
    Meteor.call('promotionSettings.remove', openForm?._id, (error) => {
      if (error) {
        handleError(error)
      } else {
        handleClose()
      }
    })
  }

  return (
    <Modal
      title={`Voraussetzungen ${openForm?._id ? 'bearbeiten' : 'erstellen'}`}
      open={openForm}
      width={(window.innerWidth / 100) * 35}
      onCancel={() => setOpenForm(false)}
      footer={null}
    >
      <Form
        layout='vertical'
        onFinish={handleFinish}
        initialValues={openForm}
      >
        <Form.Item
          label='Vorausgesetzter Rang'
          name='previousRank'
          rules={[
            {
              required: true,
              message: 'Bitte wähle mindesten einen Rang aus!',
            },
          ]}
        >
          <Select
            placeholder='Welchen Rang muss man mindestens haben?'
            options={rankOptions}
            optionFilterProp='label'
            mode='multiple'
          />
        </Form.Item>
        <Form.Item
          label='Neuer Rang'
          name='nextRank'
          rules={[
            {
              required: true,
              message: 'Bitte wähle mindesten einen Rang aus!',
            },
          ]}
        >
          <Select
            placeholder='Welchen Rang bekommt man?'
            options={rankOptions}
            optionFilterProp='label'
            mode='multiple'
          />
        </Form.Item>
        <Form.Item
          label='Missionsanzahl'
          name='missions'
          rules={[
            {
              required: true,
              message: 'Bitte gib die benötigten Missionsanzahl an!',
            },
          ]}
        >
          <Input placeholder='Wie viele Missionsanzahl werden (seit letzter Befördferung) benötigt?' />
        </Form.Item>
        <Form.Item
          label='Trainingsanzahl'
          name='trainings'
          rules={[
            {
              required: true,
              message: 'Bitte gib die benötigten Trainingsanzahl an!',
            },
          ]}
        >
          <Input placeholder='Wie viele Trainingsanzahl werden benötigt?' />
        </Form.Item>
        <Form.Item
          label='Ausbildungen / Lehrgänge'
          name='skills'
          rules={[
            {
              required: true,
              message: 'Bitte gib die benötigten Ausbildungen / Lehrgänge an!',
            },
          ]}
        >
          <Select
            placeholder='Welche Ausbildungen / Lehrgänge werden benötigt?'
            optionFilterProp='name'
            mode='multiple'
            tagRender={tagRender}
            options={skillsOptions ?? []}
            loading={!skillsOptions?.length}
          />
        </Form.Item>
        <Row
          justify='end'
          align='middle'
          gutter={16}
        >
          {openForm?._id && (
            <Col>
              <Button onClick={handleDelete}>Löschen</Button>
            </Col>
          )}
          <Col>
            <Button
              type='primary'
              htmlType='submit'
            >
              Speichern
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

const PromotionSettings = ({ securityClearance }) => {
  const { ready, settings, skills } = useTracker(() => {
    const sub = [Meteor.subscribe('promotionSettings'), Meteor.subscribe('skills')]
    return {
      ready: sub.every((s) => s.ready()),
      settings: PromotionSettingsCollection.find({}).fetch(),
      skills: SkillsCollection.find({}).fetch(),
    }
  }, [])

  const [openForm, setOpenForm] = useState(false)

  return (
    <Suspense fallback={<Col span={24}>loading...</Col>}>
      <Spin spinning={!ready}>
        {openForm && (
          <PromotionSettingsForm
            openForm={openForm}
            setOpenForm={setOpenForm}
            skills={skills}
          />
        )}
        {securityClearance > 2 && (
          <Row
            justify='end'
            style={{ padding: '0.5rem' }}
          >
            <Col>
              <Button
                type='primary'
                onClick={() => setOpenForm(true)}
                loading={!ready}
                disabled={!ready}
              >
                Voraussetungen erstellen
              </Button>
            </Col>
          </Row>
        )}
        <List
          dataSource={settings}
          pagination={
            settings?.length > 7
              ? {
                  pageSize: 7,
                  responsive: true,
                  showSizeChanger: false,
                }
              : false
          }
          renderItem={(item) => (
            <List.Item
              actions={
                securityClearance > 2
                  ? [
                      <Button
                        key='edit'
                        type='primary'
                        onClick={() => setOpenForm(item)}
                      >
                        Bearbeiten
                      </Button>,
                    ]
                  : []
              }
            >
              <Row style={{ gap: '0.5rem', width: '100%' }}>
                <Col span={24}>
                  <List.Item.Meta
                    title={`${item?.previousRank} -> ${item?.nextRank}`}
                    description={
                      <Row gutter={16}>
                        <Col
                          xs={24}
                          md={8}
                        >
                          <b>Missionsanzahl (seit letzter Befördferung):</b> {item?.missions}
                        </Col>
                        <Col
                          xs={24}
                          md={8}
                        >
                          <b>Trainingsanzahl (seit letzter Befördferung):</b> {item?.trainings}
                        </Col>
                        <Col
                          xs={24}
                          md={8}
                        >
                          <Tooltip
                            title={
                              <div>
                                {item?.skills?.map((skill) => (
                                  <div key={skill}>
                                    <Badge color={skills?.filter((s) => s._id === skill)[0]?.color || '#ccc'} />{' '}
                                    {skills?.filter((s) => s._id === skill)[0]?.name}
                                  </div>
                                ))}
                              </div>
                            }
                          >
                            <b>Ausbildungen / Lehrgänge:</b> {item?.skills?.length}
                          </Tooltip>
                        </Col>
                      </Row>
                    }
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Spin>
    </Suspense>
  )
}

const UserPromotionChecks = ({ props }) => {
  const getPromotionSettingForRank = (rank) => {
    return PromotionSettingsCollection.findOne({ previousRank: rank })
  }
  const { skills, missionsSinceLastPromotion, trainingsCount, promotionSetting } = useTracker(() => {
    const sub = [Meteor.subscribe('skills'), Meteor.subscribe('attendence.by.user', props?._id)]
    const profile = props?.profile
    const date = profile?.promotionHistory?.length ? profile.promotionHistory[0] : props?.createdAt
    const settings = getPromotionSettingForRank(profile?.rank)

    return {
      ready: sub.every((s) => s.ready()),
      skills: settings ? profile.skills?.filter((skill) => settings?.skills?.includes(skill)) : [],
      missionsSinceLastPromotion: AttendenceCollection.find({
        userIds: props?._id,
        type: 'mission',
        date: { $gte: date },
      }).count(),
      trainingsCount: AttendenceCollection.find({
        userIds: props?._id,
        type: 'training',
      }).count(),
      promotionSetting: settings,
    }
  }, [])

  const lengthSettings =
    promotionSetting?.skills?.length + Number(promotionSetting?.missions) + Number(promotionSetting?.trainings)
  const lengthCompleted = skills?.length + missionsSinceLastPromotion + trainingsCount
  const percent = promotionSetting ? Math.round((lengthCompleted / lengthSettings) * 100) : 0

  return promotionSetting ? <Progress percent={percent} /> : <></>
}

const MembersPromotionChecks = ({ props }) => {
  useTracker(() => {
    const sub = Meteor.subscribe('promotionSettings')
    return {
      settings: sub.ready() ? PromotionSettingsCollection.find({}).fetch() : [],
    }
  }, [])
  const { data, securityClearance } = props
  const [promotionSettings, setPromotionSettings] = useState('promotion-checks')

  return (
    <Col span={24}>
      <Row
        align='middle'
        justify='space-between'
        gutter={16}
        style={{ padding: '0.5rem' }}
      >
        <Col
          xs={24}
          md={12}
        >
          <span
            style={{
              margin: '0px 1.5rem 0px 0px',
              padding: '0px',
              fontSize: '24px',
              fontFamily: '"Bebas Neue", sans-serif',
            }}
          >
            BEFÖRDERUNGSCHEKS
          </span>
        </Col>
        <Col
          xs={24}
          md={12}
        >
          <Segmented
            options={[
              {
                key: 'promotion-checks',
                value: 'promotion-checks',
                label: 'Beförderungschecks',
              },
              {
                key: 'promotion-settings',
                value: 'promotion-settings',
                label: 'Einstellungen',
              },
            ]}
            value={promotionSettings}
            onChange={setPromotionSettings}
            block
          />
        </Col>
      </Row>
      {promotionSettings === 'promotion-settings' && <PromotionSettings securityClearance={securityClearance} />}
      {promotionSettings === 'promotion-checks' && (
        <List
          style={{ padding: '0.5rem' }}
          dataSource={data?.sort((a, b) => sortByRank(a.rank, b.rank))}
          pagination={
            data?.length > 10
              ? {
                  pageSize: 10,
                  responsive: true,
                  showSizeChanger: false,
                }
              : false
          }
          renderItem={(item) => {
            const nextRankMessage =
              PromotionSettingsCollection.findOne({
                previousRank: item?.profile?.rank,
              })?.nextRank.join(', ') ?? '-'

            return (
              <List.Item>
                <Row
                  style={{ width: '100%' }}
                  align='bottom'
                  gutter={16}
                  justify='space-between'
                >
                  <Col
                    xs={24}
                    md={12}
                  >
                    <List.Item.Meta
                      title={item?.profile?.name}
                      description={`Nächster Rang: ${nextRankMessage}`}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                  >
                    <UserPromotionChecks props={item} />
                  </Col>
                </Row>
              </List.Item>
            )
          }}
        />
      )}
    </Col>
  )
}

const MembersComponent = () => {
  const [selected, setSelected] = useState('active')
  const { users } = useTracker(() => {
    const sub = Meteor.subscribe('users', {})
    const squadSub = Meteor.subscribe('squads')
    const skillsSub = Meteor.subscribe('skills')
    const status = selected
    return {
      users: sub.ready()
        ? Meteor.users
            .find({ 'profile.status': status })
            .map((user) => {
              return {
                key: user._id,
                ...user,
                ...user.profile,
              }
            })
            .sort((a, b) => sortByRank(a.rank, b.rank))
        : null,
      squadsReady: squadSub.ready(),
      skillsSub: skillsSub.ready(),
    }
  }, [selected])
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false)
  const [openUserUpdateModal, setOpenUserUpdateModal] = useState(false)
  const [openUserDisplayModal, setOpenUserDisplayModal] = useState(false)
  const [openUserArchiveModal, setOpenUserArchiveModal] = useState(false)
  const [openUserReactivateModal, setOpenUserReactivateModal] = useState(false)
  const [openUserDeleteModal, setOpenUserDeleteModal] = useState(false)
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false)
  const [rowSelection, setRowSelection] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedComponent, setSelectedComponent] = useState('table')

  const options = [
    {
      key: 'active',
      value: 'active',
      label: 'Aktiv',
    },
    {
      key: 'new',
      value: 'new',
      label: 'Anwärter',
    },
    {
      key: 'inactive',
      value: 'inactive',
      label: 'Inaktiv',
    },
  ]
  const data = users?.filter((user) => {
    const userProfile = user?.profile
    return (
      userProfile?.name?.toLowerCase().includes(search?.toLowerCase()) ||
      userProfile?.rank?.toLowerCase().includes(search?.toLowerCase())
    )
  })
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance)
  const items = [
    {
      key: 'read',
      label: 'Anzeigen',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenUserDisplayModal(rowSelection.selectedRowKeys)
        } else {
          message.warning('Bitte wähle zuerst ein oder mehr Mitglieder aus!')
        }
      },
    },
    selected === 'active' && {
      key: 'edit',
      label: 'Bearbeiten',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenUserUpdateModal(rowSelection.selectedRowKeys)
        } else {
          message.warning('Bitte wähle zuerst ein oder mehr Mitglieder aus!')
        }
      },
    },
    selected === 'active' &&
      securityClearance > 3 && {
        key: 'archive',
        label: 'Archivieren',
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserArchiveModal(rowSelection.selectedRowKeys)
          } else {
            message.warning('Bitte wähle zuerst ein oder mehr Mitglieder aus!')
          }
        },
      },
    (selected === 'inactive' || selected === 'new') &&
      securityClearance > 3 && {
        key: 'reactivate',
        label: selected === 'new' ? 'Aktivieren' : 'Reaktivieren',
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserReactivateModal(rowSelection.selectedRowKeys)
          } else {
            message.warning('Bitte wähle zuerst ein oder mehr Mitglieder aus!')
          }
        },
      },
    selected === 'inactive' &&
      securityClearance > 3 && {
        key: 'delete',
        label: 'Löschen',
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserDeleteModal(rowSelection.selectedRowKeys)
          } else {
            message.warning('Bitte wähle zuerst ein oder mehr Mitglieder aus!')
          }
        },
      },
    securityClearance > 3 && {
      key: 'resetPassword',
      label: 'Passwort ändern',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          if (rowSelection?.selectedRowKeys?.length > 1) {
            message.warning('Bitte wähle nur ein Mitglied aus!')
          } else {
            if (Meteor.users.findOne(rowSelection?.selectedRowKeys[0])?.profile?.securityClearance > 3) {
              Meteor.user()?.username === 'service-admin'
                ? setOpenPasswordResetModal(rowSelection.selectedRowKeys)
                : message.error(
                    "Um die Passwörter anderer Administratoren zu verändern, verwende bitte den 'service-admin' Account!"
                  )
            } else {
              setOpenPasswordResetModal(rowSelection.selectedRowKeys)
            }
          }
        } else {
          message.warning('Bitte wähle zuerst ein Mitglied aus!')
        }
      },
    },
  ]
  const tableProps = {
    data,
    options,
    selected,
    setSelected,
    setOpenUserCreateModal,
    setOpenUserUpdateModal,
    setOpenUserDisplayModal,
    setOpenUserArchiveModal,
    setOpenUserReactivateModal,
    setOpenUserDeleteModal,
    setOpenPasswordResetModal,
    rowSelection,
    setRowSelection,
    search,
    setSearch,
    securityClearance,
    items,
    openUserCreateModal,
    openUserUpdateModal,
    openUserDisplayModal,
    openUserArchiveModal,
    openUserReactivateModal,
    openUserDeleteModal,
    openPasswordResetModal,
  }
  const promotionProps = {
    data,
    securityClearance,
  }
  return (
    <Row
      justify='space-between'
      align='middle'
    >
      {selected === 'active' && window.innerWidth > 700 && (
        <Col span={12}>
          <Row
            style={{ padding: '0.5rem' }}
            gutter={16}
          >
            <Col>
              <Statistic
                title='Mitgliederanzahl'
                value={users?.length || 0}
              />
            </Col>
            <Col>
              <Statistic
                title='Tier-3 Operator'
                value={users?.filter((user) => user?.profile?.tier === 3)?.length}
              />
            </Col>
          </Row>
        </Col>
      )}
      <Col span={selected === 'active' && window.innerWidth > 700 ? 12 : 24}>
        <Row
          gutter={16}
          justify='end'
          align='middle'
          style={{ padding: '0.5rem' }}
        >
          <Col span={24}>
            <Segmented
              block
              options={[
                {
                  key: 'table',
                  value: 'table',
                  label: 'Tabelle',
                },
                {
                  key: 'promotion-checks',
                  value: 'promotion-checks',
                  label: 'Beförderungschecks',
                },
              ]}
              value={selectedComponent}
              onChange={setSelectedComponent}
            />
          </Col>
        </Row>
      </Col>
      <Suspense
        fallback={
          <Col
            span={24}
            style={{ padding: '0.5rem' }}
          >
            loading...
          </Col>
        }
      >
        {selectedComponent === 'promotion-checks' && <MembersPromotionChecks props={promotionProps} />}
        {selectedComponent === 'table' && <MembersTable props={tableProps} />}
      </Suspense>
    </Row>
  )
}

export default MembersComponent
