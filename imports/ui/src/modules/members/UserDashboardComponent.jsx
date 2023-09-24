import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Card, Checkbox, Col, Row, Statistic, Tooltip } from "antd";
import dayjs from "dayjs";
import { SquadCollection } from "../../../../api/SquadApi";
import { AttendenceCollection } from "../../../../api/AttendenceApi";
import { SkillsCollection } from "../../../../api/SkillsApi";

const UserDashboardComponent = ({ userProp }) => {
  const { user, trainings, operations } = useTracker(() => {
    const user = Meteor.users.findOne(userProp?._id);
    const squadSub = Meteor.subscribe("squads");
    const skillsSub = Meteor.subscribe("skills");
    const sub = Meteor.subscribe("attendence.by.user", user?._id);
    if (sub.ready()) {
      return {
        user,
        trainings: AttendenceCollection.find(
          { type: "training" },
          { sort: { date: -1 } }
        ).fetch(),
        operations: AttendenceCollection.find(
          { type: "mission" },
          { sort: { date: -1 } }
        ).fetch(),
      };
    } else {
      return {
        user,
        trainings: null,
        operations: null,
        squadsReady: squadSub.ready(),
        skillsReady: skillsSub.ready(),
      };
    }
  });

  const skillOptions = SkillsCollection.find({ type: "skill" }).map((skill) => {
    return {
      key: skill._id,
      value:
        user?.profile?.skills.findIndex(
          (userSkill) =>
            SkillsCollection.findOne(userSkill)?.name === skill.name
        ) > -1,
      label: skill.name,
    };
  });

  const tier2Options = SkillsCollection.find({ type: "tier-2" }).map(
    (skill) => {
      return {
        key: skill._id,
        value:
          user?.profile?.skills.findIndex(
            (userSkill) =>
              SkillsCollection.findOne(userSkill)?.name === skill.name
          ) > -1,
        label: skill.name,
      };
    }
  );

  const specialOptionsOptions = SkillsCollection.find({ type: "special" }).map(
    (skill) => {
      return {
        key: skill._id,
        value:
          user?.profile?.skills.findIndex(
            (userSkill) =>
              SkillsCollection.findOne(userSkill)?.name === skill.name
          ) > -1,
        label: skill.name,
      };
    }
  );

  const tier1Options = SkillsCollection.find({ type: "tier-1" }).map(
    (skill) => {
      return {
        key: skill._id,
        value:
          user?.profile?.skills.findIndex(
            (userSkill) =>
              SkillsCollection.findOne(userSkill)?.name === skill.name
          ) > -1,
        label: skill.name,
      };
    }
  );

  const cardsArray = [
    {
      title: "PERSONALDATEN",
      children: (
        <Row align="end">
          <Col span={12}>Name:</Col>
          <Col span={12}>{user?.profile?.name || "-"}</Col>
          <Col span={12}>Dienstgrad:</Col>
          <Col span={12}>{user?.profile?.rank || "-"}</Col>
          <Col span={12}>Trupp:</Col>
          <Col span={12}>
            {SquadCollection.findOne(user?.profile?.squad)?.squadName || "-"}
          </Col>
          <Col span={12}>Tier-Stufe:</Col>
          <Col span={12}>{user?.profile?.tier || "-"}</Col>
        </Row>
      ),
    },
    {
      title: "ANWENSEHEIT",
      children: (
        <Row align="end">
          <Col span={12}>Einsätze:</Col>
          <Col span={12}>{operations?.length || "-"}</Col>
          <Col span={12}>Letzter Einsatz:</Col>
          <Col span={12}>
            {operations?.length
              ? dayjs(operations[operations?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "-"}
          </Col>
          <Col span={12}>Trainings:</Col>
          <Col span={12}>{trainings?.length || "-"}</Col>
          <Col span={12}>Letztes Training:</Col>
          <Col span={12}>
            {trainings?.length
              ? dayjs(trainings[trainings?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "-"}
          </Col>
        </Row>
      ),
    },
    {
      title: "BEFÖRDERUNGEN",
      children: (
        <Row align="end">
          <Col span={12}>Letzte Beförderung:</Col>
          <Col span={12}>
            {user?.profile?.promotionHistory?.length
              ? dayjs(
                  user?.profile?.promotionHistory[
                    user?.profile?.promotionHistory?.length - 1
                  ]
                ).format("DD.MM.YYYY")
              : "-"}
          </Col>
          <Col span={12}>Einsätze seitdem:</Col>
          <Col span={12}>
            {user?.profile?.promotionHistory[
              user?.profile?.promotionHistory?.length - 1
            ]
              ? AttendenceCollection.find({
                  date: {
                    $gte: user?.profile?.promotionHistory[
                      user?.profile?.promotionHistory?.length - 1
                    ],
                  },
                }).count()
              : "0"}
          </Col>
        </Row>
      ),
    },
    {
      title: "BELOHNUNGSPUNKTE",
      children: <Statistic value={user?.profile?.points || 0} />,
    },
    {
      title: "AUSBILDUNGEN",
      children: (
        <Row align="end">
          {skillOptions.map((option, index) => {
            return (
              <Col span={24} key={"option" + option.label + "-" + index}>
                <Checkbox checked={option.value} disabled>
                  {option.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      ),
    },
    {
      title: "TIER-2 LEHRGÄNGE",
      children: (
        <Row align="end">
          {tier2Options.map((option, index) => {
            return (
              <Col span={24} key={"option" + option.label + "-" + index}>
                <Checkbox checked={option.value} disabled>
                  {option.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      ),
    },
    {
      title: "SPEZIALLEHRGÄNGE",
      children: (
        <Row align="end">
          {specialOptionsOptions.map((option, index) => {
            return (
              <Col span={24} key={"option" + option.label + "-" + index}>
                <Checkbox checked={option.value} disabled>
                  {option.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      ),
    },
    {
      title: "TIER-1 LEHRGÄNGE",
      children: (
        <Row align="end">
          {tier1Options.map((option, index) => {
            return (
              <Col span={24} key={"option" + option.label + "-" + index}>
                <Checkbox checked={option.value} disabled>
                  {option.label}
                </Checkbox>
              </Col>
            );
          })}
        </Row>
      ),
    },
  ];
  return (
    <Row>
      {cardsArray.map((card, index) => {
        return (
          <Col
            key={card.title}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            style={{ padding: "0.5rem" }}
          >
            <Card
              className={`dashboard-card ${
                index === 0 || index === 2 || index === 5 || index === 7
                  ? " even"
                  : " odd"
              }`}
              title={card.title}
              children={card.children}
              bordered={false}
              style={{ height: "100%" }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default UserDashboardComponent;
