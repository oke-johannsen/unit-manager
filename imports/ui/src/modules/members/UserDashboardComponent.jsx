import { Badge, Card, Checkbox, Col, Empty, Row, Segmented, Spin, Statistic, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useEffect, useState } from 'react'
import { AttendenceCollection } from '../../../../api/AttendenceApi'
import { SkillsCollection } from '../../../../api/SkillsApi'
import { SquadCollection } from '../../../../api/SquadApi'
import { MembersPromotionChecks } from './MemberComponent'
import { runTierCheck } from './member.lib'

const UserDashboardComponent = ({ userProp }) => {
  const { user, trainings, operations, ready } = useTracker(() => {
    Meteor.subscribe('users', { _id: userProp?._id ?? null })
    const user = Meteor.users.findOne({ _id: userProp?._id ?? null })
    const squadSub = Meteor.subscribe('squads')
    const skillsSub = Meteor.subscribe('skills')
    const sub = Meteor.subscribe('attendence.by.user', user?._id)
    return {
      user,
      trainings: AttendenceCollection.find(
        { type: 'training', userIds: user?._id, date: { $lte: new Date() } },
        { sort: { date: -1 } }
      ).fetch(),
      operations: AttendenceCollection.find(
        { type: 'mission', userIds: user?._id, date: { $lte: new Date() } },
        { sort: { date: -1 } }
      ).fetch(),
      ready: squadSub.ready() && skillsSub.ready() && sub.ready(),
    }
  })

  const [designation, setDesignation] = useState('infantry')
  const [cardsArray, setCardsArray] = useState([])

  const buildCardsArray = (skillOptions, tier2Options, specialOptionsOptions, tier1Options) => {
    const check = runTierCheck(user?.profile?.tier, user?._id)
    const newCardsArray = [
      {
        title: 'PERSONALDATEN',
        children: (
          <Row align='end'>
            <Col span={12}>Name:</Col>
            <Col span={12}>{user?.profile?.name || '-'}</Col>
            <Col span={12}>Dienstgrad:</Col>
            <Col span={12}>{user?.profile?.rank || '-'}</Col>
            <Col span={12}>Tier-Stufe:</Col>
            <Col span={12}>
              <Tooltip title={check?.text}>
                <Badge
                  color={check?.color}
                  text={(user?.profile?.tier || '-') + ' (' + check?.text + ')'}
                />
              </Tooltip>
            </Col>
            <Col span={12}>Trupp:</Col>
            <Col span={12}>
              {SquadCollection?.findOne(user?.profile?.squad)?.squadName || 'Keinen Trupp ausgewählt!'}
            </Col>
            <Col span={12}>Beitrittsdatum (Einheit):</Col>
            <Col span={12}>
              {user?.createdAt ? dayjs(user?.createdAt).format('DD.MM.YYYY') : 'Kein Beitrittsdatum!'}
            </Col>
          </Row>
        ),
      },
      {
        title: 'ANWESENHEIT',
        children: (
          <Row align='end'>
            <Col span={12}>Einsätze:</Col>
            <Col span={12}>{operations?.length || '0'}</Col>
            <Col span={12}>Letzter Einsatz:</Col>
            <Col span={12}>
              {operations?.length ? dayjs(operations[0].date).format('DD.MM.YYYY') : 'Noch keine Missionen absolviert!'}
            </Col>
            <Col span={12}>Trainings:</Col>
            <Col span={12}>{trainings?.length || '0'}</Col>
            <Col span={12}>Letztes Training:</Col>
            <Col span={12}>
              {trainings?.length ? dayjs(trainings[0].date).format('DD.MM.YYYY') : 'Noch keine Trainings absolviert!'}
            </Col>
          </Row>
        ),
      },
      {
        title: 'BEFÖRDERUNGEN',
        children: (
          <Row align='end'>
            <Col span={12}>Letzte Beförderung:</Col>
            <Col span={12}>
              {user?.profile?.promotionHistory?.length
                ? dayjs(user?.profile?.promotionHistory[user?.profile?.promotionHistory?.length - 1]).format(
                    'DD.MM.YYYY'
                  )
                : 'Noch nicht befördert!'}
            </Col>
            <Col span={12}>Einsätze seitdem:</Col>
            <Col span={12}>
              {user?.profile?.promotionHistory?.length
                ? AttendenceCollection?.find({
                    date: {
                      $gt: user?.profile?.promotionHistory[user?.profile?.promotionHistory?.length - 1],
                    },
                    type: 'mission',
                    userIds: user?._id,
                  }).count()
                : AttendenceCollection?.find({ type: 'mission', userIds: user?._id }).count()}
            </Col>
          </Row>
        ),
      },
      {
        title: 'BELOHNUNGSPUNKTE',
        children: <Statistic value={user?.profile?.points || 0} />,
      },
      {
        title: designation === 'pilot' ? 'FLIEGERISCHE MODULE' : 'AUSBILDUNGEN',
        children: (
          <Row
            justify='center'
            align='middle'
          >
            {skillOptions?.length === 0 ? (
              <Empty description='Keine Ausbildungen für diese Ausbildungsart gefunden.' />
            ) : (
              skillOptions?.map((option, index) => {
                return (
                  <Col
                    span={24}
                    key={'option' + option.label + '-' + index}
                  >
                    <Checkbox
                      checked={option.value}
                      style={{ cursor: 'not-allowed' }}
                    >
                      {option.label}
                    </Checkbox>
                  </Col>
                )
              })
            )}
          </Row>
        ),
      },
      {
        title: designation === 'pilot' ? 'INFANTERISTISCHE MODULE' : 'TIER-2 LEHRGÄNGE',
        children: (
          <Row
            justify='center'
            align='middle'
          >
            {tier2Options?.length === 0 ? (
              <Empty description='Keine Ausbildungen für diese Ausbildungsart gefunden.' />
            ) : (
              tier2Options?.map((option, index) => {
                return (
                  <Col
                    span={24}
                    key={'option' + option.label + '-' + index}
                  >
                    <Checkbox
                      checked={option.value}
                      style={{ cursor: 'not-allowed' }}
                    >
                      {option.label}
                    </Checkbox>
                  </Col>
                )
              })
            )}
          </Row>
        ),
      },
      {
        title: designation === 'pilot' ? 'AUSBILDUNGEN' : 'SPEZIALLEHRGÄNGE',
        children: (
          <Row
            justify='center'
            align='middle'
          >
            {specialOptionsOptions?.length === 0 ? (
              <Empty description='Keine Ausbildungen für diese Ausbildungsart gefunden.' />
            ) : (
              specialOptionsOptions?.map((option, index) => {
                return (
                  <Col
                    span={24}
                    key={'option' + option.label + '-' + index}
                  >
                    <Checkbox
                      checked={option.value}
                      style={{ cursor: 'not-allowed' }}
                    >
                      {option.label}
                    </Checkbox>
                  </Col>
                )
              })
            )}
          </Row>
        ),
      },
      {
        title: designation === 'pilot' ? 'COMBAT READY STUFE' : 'TIER-1 LEHRGÄNGE',
        children: (
          <Row
            justify='center'
            align='middle'
          >
            {tier1Options?.length === 0 ? (
              <Empty description='Keine Ausbildungen für diese Ausbildungsart gefunden.' />
            ) : (
              tier1Options?.map((option, index) => {
                return (
                  <Col
                    span={24}
                    key={'option' + option.label + '-' + index}
                  >
                    <Checkbox
                      checked={option.value}
                      style={{ cursor: 'not-allowed' }}
                    >
                      {option.label}
                    </Checkbox>
                  </Col>
                )
              })
            )}
          </Row>
        ),
      },
    ]
    return newCardsArray
  }

  const updateOptions = () => {
    const isPilot = designation === 'pilot'
    let type = isPilot ? 'flying' : 'skill'
    const newSkillOptions = SkillsCollection.find({ type, designation }).map((skill) => {
      const index = user?.profile?.skills?.findIndex((userSkill) => {
        return userSkill === skill._id
      })
      return {
        key: skill._id,
        value: index !== -1,
        label: skill.name,
      }
    })

    type = isPilot ? 'infantry' : 'tier-2'
    const newTier2Options = SkillsCollection.find({ type, designation }).map((skill) => {
      const index = user?.profile?.skills?.findIndex((userSkill) => {
        return userSkill === skill._id
      })
      return {
        key: skill._id,
        value: index !== -1,
        label: skill.name,
      }
    })

    type = isPilot ? 'skill' : 'special'
    const newSpecialOptionsOptions = SkillsCollection.find({ type, designation }).map((skill) => {
      const index = user?.profile?.skills?.findIndex((userSkill) => userSkill === skill._id)
      return {
        key: skill._id,
        value: index !== -1,
        label: skill.name,
      }
    })

    type = isPilot ? 'crs' : 'tier-1'
    const newTier1Options = SkillsCollection.find({ type, designation }).map((skill) => {
      const index = user?.profile?.skills?.findIndex((userSkill) => userSkill === skill._id)
      return {
        key: skill._id,
        value: index !== -1,
        label: skill.name,
      }
    })
    setCardsArray(buildCardsArray(newSkillOptions, newTier2Options, newSpecialOptionsOptions, newTier1Options))
  }

  useEffect(() => {
    updateOptions(designation)
  }, [designation, ready])

  const promotionProps = {
    data: [user],
    securityClearance: user?.profile?.securityClearance,
    hideOptions: true,
  }

  return (
    <Row
      justify={!ready ? 'center' : 'start'}
      align={!ready ? 'middle' : 'stretch'}
    >
      <Col span={24}>
        <MembersPromotionChecks props={promotionProps} />
      </Col>
      <Col span={24}>
        <Row
          justify='end'
          align='middle'
        >
          <Col
            lg={6}
            md={12}
            sm={24}
            xs={24}
            style={{ paddingInline: '0.5rem' }}
          >
            <Segmented
              options={[
                { label: 'Kommando', value: 'infantry' },
                { label: 'Luftwaffe', value: 'pilot' },
              ]}
              onChange={(value) => setDesignation(value)}
              value={designation}
              block
            />
          </Col>
        </Row>
      </Col>
      {!ready ? (
        <Spin spinning />
      ) : (
        cardsArray?.map((card, index) => {
          return (
            <Col
              key={card.title}
              xxl={6}
              xl={6}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              style={{ padding: '0.5rem' }}
            >
              <Card
                className={`dashboard-card ${
                  index === 0 || index === 2 || index === 5 || index === 7 ? ' even' : ' odd'
                }`}
                title={card.title}
                children={card.children}
                bordered={false}
                style={{ height: '100%' }}
              />
            </Col>
          )
        })
      )}
    </Row>
  )
}

export default UserDashboardComponent
