import { Col, Row, Button, Form, Input, Typography, message, Divider } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import RecruitingModal from '../../modules/recruitment/RecruitingModal'

export const LegalInfo = ({ style = {} }) => {
  return (
    <div
      style={{
        ...style,
      }}
    >
      <a
        href='https://www.taskforce11.de/impressum'
        target='_blank'
        rel='noopener noreferrer'
      >
        Impressum
      </a>
      <Divider type='vertical' />
      <a
        href='https://www.taskforce11.de/datenschutz'
        target='_blank'
        rel='noopener noreferrer'
      >
        Datenschutz
      </a>
    </div>
  )
}

const LoginComponent = () => {
  const [open, setOpen] = useState(false)
  const onFinish = (values) => {
    const { username, password } = values
    Meteor.loginWithPassword({ username }, password, (err, res) => {
      if (!err) {
        message.success('Anmeldung erfolgreich!')
      } else {
        console.error('Error in loginWithPassword', err, res)
        message.error('Anmeldung fehlgeschlagen!')
      }
    })
  }
  return (
    <Row
      justify='center'
      align='middle'
      style={{ height: '60%' }}
    >
      <div id='login-background' />
      <Col
        id='login-container'
        xs={20}
        sm={20}
        md={16}
        lg={12}
        xl={10}
        xxl={8}
        style={{
          padding: '2rem',
          borderRadius: 8,
          background: '#101010',
        }}
      >
        <Typography>
          <h3>Task Force 11 - Einheitsverwaltung</h3>
        </Typography>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name='username'
            rules={[
              {
                required: true,
                message: 'Bitte Benutzernamen eingeben!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              autoComplete='username'
              placeholder='Benutzername'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Bitte Passwort eingeben!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Passwort'
              autoComplete='current-password'
              visibilityToggle
            />
          </Form.Item>

          <Form.Item>
            <Row
              justify='space-between'
              align='middle'
              gutter={8}
            >
              <Col>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-form-button'
                >
                  Anmelden
                </Button>
              </Col>
              <Col flex='auto'>
                Oder <a onClick={() => setOpen(true)}>jetzt bewerben!</a>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
      <RecruitingModal
        open={open}
        setOpen={setOpen}
      />
      <LegalInfo
        style={{
          position: 'absolute',
          bottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#101010',
          padding: '0.5rem 1rem',
          borderRadius: 8,
          right: '1rem',
        }}
      />
    </Row>
  )
}

export default LoginComponent
