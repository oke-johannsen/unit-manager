import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Switch } from 'antd'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useEffect, useState } from 'react'
import AttendenceTypeModal from './AttendenceTypeModal'

const AttendenceForm = ({ type, form, setForm, disabled, activeKey, attendenceTypeOptions }) => {
  const { userOptions } = useTracker(() => {
    Meteor.subscribe('users', {})
    return {
      userOptions: Meteor.users.find({}).map((user) => {
        return {
          key: user._id,
          value: user._id,
          label: user.profile?.name,
        }
      }),
    }
  }, [])
  let render
  const defaults = activeKey ? form?.filter((item) => item._id === activeKey)[0] : form
  defaults.userIds = (defaults.userIds || [])?.filter((id) => userOptions.find((user) => user.value === id))
  defaults.zeusUserIds = (defaults.zeusUserIds || [])?.filter((id) => userOptions.find((user) => user.value === id))
  defaults.promotedMembers = (defaults.promotedMembers || [])?.filter((id) =>
    userOptions.find((user) => user.value === id)
  )
  const formDefaults = defaults
  const [userIds, setUserIds] = useState(
    (activeKey ? form?.filter((item) => item._id === activeKey)[0]?.userIds : form.userIds) || []
  )
  const [zeusUserIds, setZeusUserIds] = useState(
    (activeKey ? form?.filter((item) => item._id === activeKey)[0]?.zeusUserIds : form.zeusUserIds) || []
  )
  const handleValuesChange = (allValues) => {
    if (type === 'update') {
      const tempForm = [...form]
      const newForm = tempForm.map((item) => {
        if (item._id === allValues._id) {
          return allValues
        } else {
          return item
        }
      })
      setForm(newForm)
    } else {
      setForm(allValues)
    }
  }
  useEffect(() => {
    if (type === 'update') {
      const data = form.filter((item) => item._id === activeKey)[0]
      data.promotedMembers.forEach((userId, index) => {
        if (!data.userIds.includes(userId)) {
          data.promotedMembers.splice(index, 1)
        }
      })
      const newForm = form.map((item) => {
        return item._id === activeKey ? data : item
      })
      setForm(newForm)
    }
  }, [userIds])
  const [open, setOpen] = useState(false)
  const formComponent = (
    <Form
      initialValues={formDefaults}
      layout='vertical'
      labelCol={24}
      onValuesChange={(_, allValues) => handleValuesChange(allValues)}
      disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
    >
      <Row gutter={8}>
        <Form.Item
          label='id'
          name='_id'
          hidden
        >
          <Input disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2} />
        </Form.Item>
        <Col span={24}>
          <Form.Item
            label='Einsatzname'
            name='title'
          >
            <Input disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Row
            gutter={8}
            align='bottom'
          >
            <Col flex='auto'>
              <Form.Item
                label='Einsatzart'
                name='type'
                rules={[{ required: true }]}
              >
                <Select
                  disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
                  options={attendenceTypeOptions}
                  optionFilterProp='label'
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
                onClick={() => setOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <PlusOutlined />
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <Row style={{ flexWrap: 'nowrap', gap: 8 }}>
            <Col flex='auto'>
              <Form.Item
                label='Datum'
                name='date'
                rules={[{ required: true }]}
              >
                <DatePicker
                  disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
                  style={{ width: '100%' }}
                  format='DD.MM.YYYY HH:mm'
                  allowClear={false}
                  showHour
                  showMinute
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='Ganztägig'
                name='wholeDay'
              >
                <Switch disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Form.Item
        label='Zeuse'
        name='zeusUserIds'
        rules={[{ required: true, message: 'Bitte wähle Zeuse aus!' }]}
      >
        <Select
          disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
          optionFilterProp='label'
          mode='multiple'
          value={zeusUserIds?.filter((id) => userOptions?.find((user) => user?.key === id))}
          onChange={setZeusUserIds}
          options={userOptions}
        />
      </Form.Item>
      <Form.Item
        label='Teilnehmer'
        name='userIds'
        rules={[{ required: true, message: 'Bitte wähle Teilnehmer aus!' }]}
      >
        <Select
          disabled={disabled || (Number(Meteor.user()?.profile?.securityClearance) ?? 0) < 2}
          optionFilterProp='label'
          mode='multiple'
          value={userIds?.filter((id) => userOptions?.find((user) => user?.key === id))}
          onChange={setUserIds}
          options={userOptions}
        />
      </Form.Item>
      <Form.Item
        label='Beförderte Mitglieder'
        name='promotedMembers'
      >
        <Select
          optionFilterProp='label'
          mode='multiple'
          disabled={disabled || userIds?.length === 0 || Number(Meteor.user()?.profile?.securityClearance) < 3}
          placeholder={
            userIds?.length === 0
              ? 'Zuerst Teilnehmer auswählen'
              : Number(Meteor.user()?.profile?.securityClearance) < 3
              ? 'Nicht ausreichend berechtigt!'
              : ''
          }
          options={userOptions?.filter((option) => userIds?.includes(option.key))}
        />
      </Form.Item>
    </Form>
  )
  switch (type) {
    case 'insert':
    case 'display':
      render = formComponent
      break
    case 'delete':
      render = <>delete</>
      break
    case 'update':
      render = formComponent
      break
    default:
      render = <></>
      break
  }
  return (
    <Spin spinning={!userOptions}>
      {render}
      {open && (
        <AttendenceTypeModal
          open={open}
          setOpen={setOpen}
        />
      )}
    </Spin>
  )
}

export default AttendenceForm
