import React, { useMemo } from 'react'
import { Form, Select, Input, Row, Col, Button, message, Collapse } from 'antd'
import dayjs from 'dayjs'
import { orders, troops } from './troops.lib'
import { Meteor } from 'meteor/meteor'
import { AttendenceCollection } from '../../../../../../api/AttendenceApi'

const handleModel = (model = {}) => {
  return {
    'attendenceId': model?.attendenceId,
    'ramification': model?.ramification,
    'enemySituation': model?.enemySituation,
    'friendlySituation': model?.friendlySituation,
    'civilSituation': model?.civilSituation,
    'geoSituation': model?.geoSituation,
    'orders': model?.orders,
    'execution': model?.execution,
    'support': model?.support,
    'leadershipSupport': model?.leadershipSupport,
    'commander-01': model?.['commander-01'],
    'jsft-01': model?.['jsft-01'],
    'jsft-02': model?.['jsft-02'],
    'jsft-03': model?.['jsft-03'],
    'jsft-04': model?.['jsft-04'],
    'toc-01': model?.['toc-01'],
    'toc-02': model?.['toc-02'],
    'toc-03': model?.['toc-03'],
    'toc-04': model?.['toc-04'],
    'alpha-01': model?.['alpha-01'],
    'alpha-02': model?.['alpha-02'],
    'alpha-03': model?.['alpha-03'],
    'alpha-04': model?.['alpha-04'],
    'alpha-05': model?.['alpha-05'],
    'alpha-06': model?.['alpha-06'],
    'bravo-01': model?.['bravo-01'],
    'bravo-02': model?.['bravo-02'],
    'bravo-03': model?.['bravo-03'],
    'bravo-04': model?.['bravo-04'],
    'bravo-05': model?.['bravo-05'],
    'bravo-06': model?.['bravo-06'],
    'charlie-01': model?.['charlie-01'],
    'charlie-02': model?.['charlie-02'],
    'charlie-03': model?.['charlie-03'],
    'charlie-04': model?.['charlie-04'],
    'charlie-05': model?.['charlie-05'],
    'charlie-06': model?.['charlie-06'],
    'delta-01': model?.['delta-01'],
    'delta-02': model?.['delta-02'],
    'delta-03': model?.['delta-03'],
    'delta-04': model?.['delta-04'],
    'delta-05': model?.['delta-05'],
    'delta-06': model?.['delta-06'],
    'echo-01': model?.['echo-01'],
    'echo-02': model?.['echo-02'],
    'echo-03': model?.['echo-03'],
    'echo-04': model?.['echo-04'],
    'echo-05': model?.['echo-05'],
    'echo-06': model?.['echo-06'],
  }
}
const getTypeName = (attencence) => {
  if (attencence.type) {
    switch (attencence.type) {
      case 'mission':
        return 'Einsatz'
      case 'training':
        return 'Training'
      default:
        return attencence.type
    }
  } else {
    return '###'
  }
}
const submitCallback = (error) => {
  if (error) {
    console.error(error)
  } else {
    message.success('Erfolgreich gespeichert')
    onCancel()
  }
}

const BriefingForm = ({ model, onCancel }) => {
  const initialValues = useMemo(() => handleModel(model), [model])
  const attendenceOptions = useMemo(
    () =>
      AttendenceCollection.find({}, { sort: { date: -1 } }).map((a) => {
        return {
          value: a._id,
          label: dayjs(a.date).format('DD.MM.YYYY') + ': ' + (a.title ?? ' - ' + getTypeName(a)),
          key: a._id,
        }
      }),
    []
  )
  const userOptions = useMemo(
    () =>
      Meteor.users
        .find({ 'profile.status': { $ne: 'inactive' } })
        .map((u) => ({ key: u._id, value: u._id, label: u.profile?.name })),
    []
  )
  const handleSubmit = (values) => {
    if (model?._id) {
      Meteor.call('briefings.update', model._id, values, submitCallback)
    } else {
      Meteor.call('briefings.create', values, submitCallback)
    }
  }

  return (
    <Form
      initialValues={initialValues}
      layout='vertical'
      onFinish={handleSubmit}
      disabled={Meteor.user()?.profile?.securityClearance < 3}
    >
      <Form.Item
        label='Einsatz'
        name='attendenceId'
        rules={[{ required: true, message: 'Bitte wähle einen Einsatz' }]}
      >
        <Select
          options={attendenceOptions}
          optionFilterProp='label'
          showSearch
        />
      </Form.Item>
      <Collapse
        style={{ marginBottom: 16, maxHeight: '50vh', overflowY: 'auto' }}
        items={[
          {
            key: 'orders',
            label: 'Befehlsausgabe',
            children: orders.map(({ label, name }) => {
              return (
                <Form.Item
                  key={name}
                  label={label}
                  name={name}
                >
                  <Input.TextArea />
                </Form.Item>
              )
            }),
          },
          {
            key: 'troops',
            label: 'Zuteilung',
            children: troops.map(({ label, name, nodes }) => {
              return (
                <div key={name}>
                  <h3>{label}</h3>
                  {nodes.map(({ callsign, key }) => {
                    return (
                      <Row key={key}>
                        <Col span={24}>
                          <Form.Item
                            label={callsign}
                            name={key}
                          >
                            <Select
                              options={userOptions}
                              optionFilterProp='label'
                              showSearch
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  })}
                </div>
              )
            }),
          },
        ]}
        accordion
      />
      <Row
        gutter={[16, 16]}
        justify='end'
        align='bottom'
      >
        <Col>
          <Button onClick={onCancel}>Abbrechen</Button>
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

export default BriefingForm
