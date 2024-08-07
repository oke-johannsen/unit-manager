import { Badge, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { SquadCollection } from '../../../../api/SquadApi'
import { ranks } from '../../libs/SORTER_LIB'

const PASSWORD_PATTER = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\*\.\-!"§\$%&\*+#':;<>@\d]).{8,}$/

const rankOptions = ranks

const UserForm = ({ userId, closeModal, forms, setForms, submitForms }) => {
  const { skillsOptions, squadOptions } = useTracker(() => {
    Meteor.subscribe('skills')
    const squads = SquadCollection.find().map((squad) => {
      return {
        value: squad._id,
        label: squad.squadName,
      }
    })
    squads.push({ value: null, label: 'Nicht besetzt' })
    return {
      skillsOptions: SkillsCollection.find().map((skill) => {
        return {
          value: skill._id,
          label: (
            <span>
              <Badge color={skill.color || '#ccc'} /> {skill.name}
            </span>
          ),
          name: skill.name,
          color: skill.color || '#ccc',
        }
      }),
      squadOptions: squads,
    }
  }, [])
  const onFinish = () => {
    submitForms(forms)
  }
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }
  const user = Meteor.users.findOne(userId)
  const userData = user
    ? {
        ...user,
        ...user.profile,
        createdAt: dayjs(user?.createdAt),
      }
    : {
        username: undefined,
        password: undefined,
        name: undefined,
        tier: 3,
        rank: 'Unteroffizier',
        designation: 'KSM',
        squadPosition: 7,
        securityClearance: 1,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
        createdAt: dayjs(),
      }

  const checkUsernameForDuplicate = async (_, username) => {
    const activeUser = Meteor.users.findOne(userId)
    if (activeUser?.username === username) {
      await Promise.resolve()
    } else {
      const user = Meteor.users.findOne({ username })
      if (user) {
        await Promise.reject(new Error(`${username} wird bereits verwendet!`))
      } else {
        await Promise.resolve()
      }
    }
  }

  const tagRender = (item) => {
    const skill = skillsOptions?.filter((option) => option.value === item.value)[0]
    return skill ? (
      <Tag
        style={{ margin: '0.2rem' }}
        color={skill?.color}
        value={skill?.value}
      >
        {skill?.name}
      </Tag>
    ) : (
      item?.value
    )
  }
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance)
  return (
    <Form
      layout='vertical'
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      onFinish={onFinish}
      onValuesChange={(_changedValues, allValues) => {
        const data = { ...forms }
        data[userId || 'new'] = allValues
        setForms(data)
      }}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
      initialValues={userData}
    >
      <Divider>Account</Divider>
      <Form.Item
        label='Benutzername'
        name='username'
        rules={[
          {
            required: true,
            message: 'Bitte Benutzernamen eintragen!',
          },
          {
            validator: checkUsernameForDuplicate,
          },
        ]}
      >
        <Input
          autoComplete='username'
          disabled={securityClearance < 4}
        />
      </Form.Item>

      {!userId && (
        <Form.Item
          label='Passwort'
          name='password'
          rules={[
            {
              required: true,
              message: 'Bitte Passwort eintragen!',
            },
            {
              min: 6,
              message: 'Dein Passwort muss aus mindestens 6 Zeichen bestehen!',
            },
            {
              pattern: PASSWORD_PATTER,
              message:
                'Das Passwort muss aus min. 1 Großbuchstaben, 1 Kleinbuchstaben, 1 Sonderzeichen und 1 Zahl bestehen!',
            },
          ]}
        >
          <Input.Password autoComplete='current-password' />
        </Form.Item>
      )}

      <Divider>Stammdaten</Divider>

      <Row gutter={8}>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[
              {
                required: true,
                message: 'Bitte Namen eintragen!',
              },
            ]}
          >
            <Input disabled={securityClearance < 3} />
          </Form.Item>
        </Col>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Tier'
            name='tier'
          >
            <Select
              disabled={securityClearance < 3}
              optionFilterProp='label'
            >
              <Select.Option value={3}>3</Select.Option>
              <Select.Option value={2}>2</Select.Option>
              <Select.Option value={1}>1</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Zugehörigkeit'
            name='designation'
          >
            <Select
              disabled={securityClearance < 3}
              optionFilterProp='label'
            >
              <Select.Option value={null}>Keine Zugehörigkeit</Select.Option>
              <Select.Option value='KSM'>KSM</Select.Option>
              <Select.Option value='Luftwaffe'>Luftwaffe</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Dienstgrad'
            name='rank'
            optionFilterProp='label'
          >
            <Select
              disabled={securityClearance < 3}
              options={rankOptions}
              optionFilterProp='label'
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Trupp'
            name='squad'
          >
            <Select
              disabled={securityClearance < 3}
              options={squadOptions || []}
              optionFilterProp='label'
            />
          </Form.Item>
        </Col>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Trupp-Position'
            name='squadPosition'
          >
            <Select
              disabled={securityClearance < 3}
              optionFilterProp='label'
              options={[
                { key: 0, label: 'Keine Position', value: null },
                { key: 1, label: '1', value: 1 },
                { key: 2, label: '2', value: 2 },
                { key: 3, label: '3', value: 3 },
                { key: 4, label: '4', value: 4 },
                { key: 5, label: '5', value: 5 },
                { key: 6, label: '6', value: 6 },
                { key: 7, label: 'Strap', value: 7 },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Organisatorisches</Divider>

      <Form.Item
        label='Ausbildungen'
        name='skills'
      >
        <Select
          optionFilterProp='label'
          mode='multiple'
          tagRender={tagRender}
          options={skillsOptions || []}
          disabled={securityClearance < 2}
        />
      </Form.Item>

      <Row gutter={8}>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Sicherheitsstufe'
            name='securityClearance'
          >
            <Select
              disabled={securityClearance < 4}
              optionFilterProp='label'
            >
              <Select.Option value='1'>1</Select.Option>
              <Select.Option value='2'>2</Select.Option>
              <Select.Option value='3'>3</Select.Option>
              <Select.Option value='4'>4</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Betrittsdatum'
            name='createdAt'
          >
            <DatePicker
              style={{ width: '100%' }}
              format='DD.MM.YYYY'
              disabled={securityClearance < 3}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Belohnungspunkte'
            name='points'
          >
            <InputNumber
              style={{ width: '100%' }}
              step={5}
              disabled={securityClearance < 4}
            />
          </Form.Item>
        </Col>
        <Col
          lg={12}
          md={24}
        >
          <Form.Item
            label='Inaktivitätspunkte'
            name='inactivityPoints'
          >
            <InputNumber
              style={{ width: '100%' }}
              disabled={securityClearance < 3}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row
        justify='end'
        gutter={8}
        align='middle'
      >
        <Col>
          <Button onClick={() => closeModal()}>Abbrechen</Button>
        </Col>
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
  )
}

export default UserForm
