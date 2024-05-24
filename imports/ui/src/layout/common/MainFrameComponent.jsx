import React, { useState } from 'react'
import { Button, Col, Drawer, Grid, Layout, Row, Tooltip, message } from 'antd'
import { Meteor } from 'meteor/meteor'
import { LogoutOutlined, MenuOutlined, UnlockOutlined } from '@ant-design/icons'
import ViewController from './ViewController'
import PasswordResetModal from './PasswordResetModal'
import SidebarComponent from './SidebarComponent'
import { LegalInfo } from '../login/LoginComponent'
const { Header, Content, Footer } = Layout

const MainFrameComponent = () => {
  const [view, setView] = useState('dashboard')
  const [open, setOpen] = useState(false)
  const user = Meteor.user()
  const breakpoints = Grid.useBreakpoint()
  const headerStyle = {
    height: !breakpoints.sm ? 'auto' : 90,
    lineHeight: '90px',
    paddingInline: '0.5rem',
  }
  const contentStyle = {
    color: '#d1d1d1',
    padding: '32px 16px',
    height: 'calc(100% - 90px)',
    overflowY: 'auto',
  }
  const footerStyle = {
    textAlign: 'center',
  }
  const [openDrawer, setOpenDrawer] = useState(false)
  return (
    <Layout style={{ height: '100%' }}>
      {!breakpoints.xs && <SidebarComponent setView={setView} />}
      <Layout>
        <Header style={headerStyle}>
          <Row
            justify='space-between'
            align='middle'
            style={{ height: 80 }}
          >
            {breakpoints.xs && (
              <Col className='layer-2'>
                <Row gutter={[8, 8]}>
                  <Col
                    className='layer-2'
                    style={{ height: 82 }}
                  >
                    <img
                      src='/images/logo.webp'
                      alt=''
                      style={{
                        padding: '0.5rem',
                        height: 82,
                        position: 'relative',
                        zIndex: 2,
                        aspectRatio: 1,
                      }}
                      fetchpriority='high'
                      rel='preload'
                    />
                  </Col>
                  <Col className='layer-2'>
                    <Button
                      size='large'
                      icon={<MenuOutlined />}
                      onClick={() => setOpenDrawer(true)}
                    />
                    <Drawer
                      title='Navigation'
                      open={openDrawer}
                      onClose={() => setOpenDrawer(false)}
                    >
                      <SidebarComponent
                        setView={(e) => {
                          setView(e)
                          setOpenDrawer(false)
                        }}
                      />
                    </Drawer>
                  </Col>
                </Row>
              </Col>
            )}
            {breakpoints.lg && (
              <Col
                className='layer-2'
                style={{
                  fontSize: !breakpoints.sm ? '1.2rem' : '1.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                flex='auto'
              >
                {`Willkommen, ${user?.profile?.name}!`}
              </Col>
            )}
            <Col className='layer-2'>
              <Row
                gutter={16}
                justify='end'
                align='middle'
              >
                <Col>
                  <Button
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    type='ghost'
                    onClick={() => setOpen(true)}
                  >
                    <Tooltip
                      title='Passwort ändern'
                      className='layer-2'
                    >
                      <UnlockOutlined style={{ color: '#D1D1D1', fontSize: 32 }} />
                    </Tooltip>
                  </Button>
                  <PasswordResetModal
                    open={open}
                    setOpen={setOpen}
                    userId={user?._id}
                  />
                </Col>
                <Col>
                  <Button
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    type='ghost'
                    onClick={() =>
                      Meteor.logout((err, res) => {
                        if (!err) {
                          message.success('Abmeldung erfolgreich!')
                        } else {
                          message.error('Abmeldung fehgeschlagen!')
                          console.error('Error in Meteor.logout', err, res)
                        }
                      })
                    }
                  >
                    <Tooltip
                      title='Abmelden'
                      className='layer-2'
                    >
                      <LogoutOutlined style={{ color: '#D1D1D1', fontSize: 32 }} />
                    </Tooltip>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content style={contentStyle}>
          <ViewController
            view={view}
            setView={setView}
          />
        </Content>
        {breakpoints.lg && (
          <Footer style={footerStyle}>
            <Row
              gutter={16}
              justify='space-between'
              align='bottom'
            >
              <Col>
                <LegalInfo
                  style={{
                    background: '#101010',
                    padding: '0.5rem 1rem',
                    borderRadius: 8,
                  }}
                />
              </Col>
              <Col flex='auto'>
                <Row
                  gutter={16}
                  justify='end'
                  align='bottom'
                >
                  <Col>
                    <a
                      href='http://steamcommunity.com/groups/TaskForce-11'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Steam Gruppe
                    </a>
                  </Col>
                  <Col>
                    <a
                      href='https://units.arma3.com/unit/taskforce11'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Arma 3 Unit
                    </a>
                  </Col>
                  <Col>
                    <a
                      href='ts3server://ts.TaskForce11.de'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      TeamSpeak
                    </a>
                  </Col>
                  <Col>
                    <a
                      href='https://discord.gg/74cPDMcyaU'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Discord
                    </a>
                  </Col>
                  <Col>|</Col>
                  <Col>
                    <a
                      href='https://www.taskforce11.de/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Task Force 11 <sup>TM</sup>
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Footer>
        )}
      </Layout>
    </Layout>
  )
}

export default MainFrameComponent
