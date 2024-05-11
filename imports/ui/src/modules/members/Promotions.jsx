import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popover,
  Progress,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip,
} from 'antd'
import React, { Suspense, useMemo, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { PromotionSettingsCollection } from '../../../../api/PromotionSettingsApi'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { ranks } from '../../libs/SORTER_LIB'

const rankOptions = ranks

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
          label='Missionsanzahl (seit letzter Befördung)'
          name='missions'
          rules={[
            {
              required: true,
              message: 'Bitte gib die benötigte Missionsanzahl an!',
            },
          ]}
        >
          <Input placeholder='Wie viele Missionen werden (seit letzter Befördferung) benötigt?' />
        </Form.Item>
        <Form.Item
          label='Trainingsanzahl'
          name='trainings'
          rules={[
            {
              required: true,
              message: 'Bitte gib die benötigte Trainingsanzahl an!',
            },
          ]}
        >
          <Input placeholder='Wie viele Trainings werden benötigt?' />
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
        <Row>
          <Col span={24}>
            <Form.Item
              label='Mindestanzahl von optionalen Ausbildungen / Lehrgänge'
              placeholder='Wie viele optionalen Ausbildungen / Lehrgängen werden mindestens benötigt?'
              name='optionalSkillsAmount'
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label='Optionale Ausbildungen / Lehrgänge'
              name='optionalSkills'
              rules={[
                {
                  required: true,
                  message: 'Bitte gib die benötigten Ausbildungen / Lehrgänge an!',
                },
              ]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder='Welche optionalen Ausbildungen / Lehrgänge werden benötigt?'
                optionFilterProp='name'
                mode='multiple'
                tagRender={tagRender}
                options={skillsOptions ?? []}
                loading={!skillsOptions?.length}
              />
            </Form.Item>
          </Col>
        </Row>
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
        {securityClearance > 3 && (
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
            settings?.length > 10
              ? {
                  responsive: true,
                  showSizeChanger: true,
                  hideOnSinglePage: true,
                }
              : false
          }
          renderItem={(item) => (
            <List.Item
              actions={
                securityClearance > 3
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
                          <b>Trainingsanzahl:</b> {item?.trainings}
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

const PromotionTooltip = ({ settings }) => {
  return (
    <Row style={{ maxWidth: 800 }}>
      <Col span={12}>Noch benötigte Ausbildungen:</Col>
      <Col span={12}>{settings?.skills?.length ? settings?.skills?.join(', ') : '-'}</Col>
      <Col span={12}>Noch benötigte Trainings:</Col>
      <Col span={12}>{settings?.trainings}</Col>
      <Col span={12}>Noch benötigte Missionen:</Col>
      <Col span={12}>{settings?.missions}</Col>
      <Col span={12}>Noch benötigte Anzahl an optionalen Ausbildungen:</Col>
      <Col span={12}>{settings?.optionalSkills}</Col>
    </Row>
  )
}

const UserPromotionChecks = ({ props }) => {
  const getPromotionSettingForRank = (rank) => {
    return PromotionSettingsCollection.findOne({ previousRank: rank })
  }
  const settings = useMemo(() => getPromotionSettingForRank(props?.profile?.rank), [props])

  return settings ? (
    <Popover
      placement='bottomLeft'
      content={
        <PromotionTooltip
          settings={{
            skills: props?.missingSkills,
            missions: props?.missingMissions < 1 ? 0 : props?.missingMissions,
            trainings: props?.missingTrainings < 1 ? 0 : props?.missingTrainings,
            optionalSkills: props?.missingOptionalSkillsAmount < 1 ? 0 : props?.missingOptionalSkillsAmount,
          }}
        />
      }
    >
      <Progress percent={props?.percent} />
    </Popover>
  ) : (
    <></>
  )
}

export { UserPromotionChecks, PromotionSettings }
