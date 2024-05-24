import { AppstoreFilled, HddFilled } from '@ant-design/icons'
import { Badge, Button, Col, Divider, Grid, Layout, Row } from 'antd'
import React from 'react'
import { Meteor } from 'meteor/meteor'
import HeaderComponent from './HeaderComponent'
import MEMBER_SVG from '../../assets/MEMBER_SVG'
import RECRUITMENT_SVG from '../../assets/RECRUITMENT_SVG'
import SKILLS_SVG from '../../assets/SKILLS_SVG'
import ATTENDENCE_SVG from '../../assets/ATTENDENCE_SVG'
import SQUADS_SVG from '../../assets/SQUADS_SVG'
import { RecruitmentCollection } from '../../../../api/RecruitmentsApi'
import { useTracker } from 'meteor/react-meteor-data'
const { Sider } = Layout

const SidebarComponent = ({ setView }) => {
  const { openCount } = useTracker(() => {
    const handle = Meteor.subscribe('recruitments', { status: 'open' })
    return {
      openCount: handle.ready() ? RecruitmentCollection.find({ status: 'open' })?.count() : 0,
    }
  }, [])

  const siderStyle = {
    color: '#d1d1d1',
  }
  const options = [
    {
      view: 'dashboard',
      icon: <AppstoreFilled style={{ fontSize: 48, color: 'inherit' }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: 'inherit',
          }}
        >
          DASHBOARD
        </span>
      ),
      color: '#5f1d1d',
    },
    {
      view: 'members',
      icon: <MEMBER_SVG style={{ fontSize: 48, color: 'inherit' }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: 'inherit',
          }}
        >
          MITGLIEDER
        </span>
      ),
      color: '#698eae',
    },
    {
      view: 'squads',
      icon: <SQUADS_SVG style={{ fontSize: 48, color: 'inherit' }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: 'inherit',
          }}
        >
          TRUPPS
        </span>
      ),
      color: '#323232',
    },
    {
      view: 'attendence',
      icon: <ATTENDENCE_SVG style={{ fontSize: 48, color: 'inherit' }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: 'inherit',
          }}
        >
          EINSÄTZE
        </span>
      ),
      color: '#4a873b',
    },
    ...(Number(Meteor.user()?.profile?.securityClearance) > 2
      ? [
          {
            view: 'recruitment',
            icon: <RECRUITMENT_SVG style={{ fontSize: 48, color: 'inherit' }} />,
            text: (
              <Badge
                count={openCount}
                offset={[13, -2]}
                style={{ color: '#fff' }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: '#545a83',
                  }}
                >
                  BEWERBUNGEN
                </span>
              </Badge>
            ),
            color: '#545a83',
          },
        ]
      : []),
    {
      view: 'skills',
      icon: <SKILLS_SVG style={{ fontSize: 48, color: 'inherit' }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: 'inherit',
          }}
        >
          AUSBILDUNGEN
        </span>
      ),
      color: '#b32f2f',
    },
    ...(Number(Meteor.user()?.profile?.securityClearance) > 3
      ? [
          {
            view: 'logging',
            icon: <HddFilled style={{ fontSize: 48, color: 'inherit' }} />,
            text: (
              <span
                style={{
                  fontSize: 18,
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: 'inherit',
                }}
              >
                Logs
              </span>
            ),
            color: '#AAA',
          },
        ]
      : []),
  ]
  const breakpoints = Grid.useBreakpoint()
  if (breakpoints.xs) {
    return (
      <Options
        setView={setView}
        options={options}
      />
    )
  }
  return (
    <Sider
      style={siderStyle}
      width={150}
    >
      <Options
        setView={setView}
        options={options}
      />
    </Sider>
  )
}

const Options = ({ setView, options }) => {
  const breakpoints = Grid.useBreakpoint()
  return (
    <Row
      justify='center'
      align='top'
      style={{ height: '100%' }}
    >
      {!breakpoints.xs && (
        <Col className='layer-2'>
          <HeaderComponent />
        </Col>
      )}
      <Col
        span={24}
        style={{
          paddingTop: 32,
          background: '#80808',
          height: 'calc(100% - 90px)',
          overflow: 'auto',
        }}
      >
        <Row gutter={[0, 16]}>
          {options.map((option, index) => {
            return (
              <Col
                span={24}
                key={option.view}
              >
                <Button
                  className='sider-button'
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: option.color,
                  }}
                  type='ghost'
                  onClick={() => {
                    setView(option.view)
                  }}
                >
                  <Row
                    justify='center'
                    align='middle'
                    style={{ flexDirection: 'column' }}
                  >
                    <Col>{option.icon}</Col>
                    <Col>{option.text}</Col>
                  </Row>
                </Button>
                {index !== options.length - 1 && (
                  <Divider
                    style={{
                      margin: '0 auto',
                      width: '80%',
                      minWidth: '80%',
                    }}
                  />
                )}
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}

export default SidebarComponent
