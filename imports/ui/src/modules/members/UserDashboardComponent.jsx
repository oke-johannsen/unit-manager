import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Card, Checkbox, Col, Empty, Row, Spin, Statistic } from "antd";
import dayjs from "dayjs";
import { SquadCollection } from "../../../../api/SquadApi";
import { AttendenceCollection } from "../../../../api/AttendenceApi";
import { SkillsCollection } from "../../../../api/SkillsApi";
import { WarningOutlined } from "@ant-design/icons";

const UserDashboardComponent = () => {
  const { user, trainings, operations, ready } = useTracker(() => {
    const user = Meteor.user();
    const squadSub = Meteor.subscribe("squads");
    const skillsSub = Meteor.subscribe("skills");
    const sub = Meteor.subscribe("attendence.by.user", user?._id);
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
      ready: squadSub.ready() && skillsSub.ready() && sub.ready(),
    };
  });

  const skillOptions = SkillsCollection?.find({ type: "skill" }).map(
    (skill) => {
      const index = user?.profile?.skills.findIndex(
        (userSkill) => SkillsCollection.findOne(userSkill)?.name === skill.name
      );
      return {
        key: skill._id,
        value: index ? index > 1 : false,
        label: skill.name,
      };
    }
  );

  const tier2Options = SkillsCollection?.find({ type: "tier-2" }).map(
    (skill) => {
      const index = user?.profile?.skills.findIndex(
        (userSkill) => SkillsCollection.findOne(userSkill)?.name === skill.name
      );
      return {
        key: skill._id,
        value: index ? index > 1 : false,
        label: skill.name,
      };
    }
  );

  const specialOptionsOptions = SkillsCollection?.find({ type: "special" }).map(
    (skill) => {
      const index = user?.profile?.skills.findIndex(
        (userSkill) => SkillsCollection.findOne(userSkill)?.name === skill.name
      );
      return {
        key: skill._id,
        value: index ? index > 1 : false,
        label: skill.name,
      };
    }
  );

  const tier1Options = SkillsCollection?.find({ type: "tier-1" }).map(
    (skill) => {
      const index = user?.profile?.skills.findIndex(
        (userSkill) => SkillsCollection.findOne(userSkill)?.name === skill.name
      );
      return {
        key: skill._id,
        value: index ? index > 1 : false,
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
          <Col span={12}>Tier-Stufe:</Col>
          <Col span={12}>{user?.profile?.tier || "-"}</Col>
          <Col span={12}>Trupp:</Col>
          <Col span={12}>
            {SquadCollection?.findOne(user?.profile?.squad)?.squadName ||
              "Kein Trupp ausgewählt!"}
          </Col>
        </Row>
      ),
    },
    {
      title: "ANWENSEHEIT",
      children: (
        <Row align="end">
          <Col span={12}>Einsätze:</Col>
          <Col span={12}>{operations?.length || "0"}</Col>
          <Col span={12}>Letzter Einsatz:</Col>
          <Col span={12}>
            {operations?.length
              ? dayjs(operations[operations?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "Noch keine Missionen absolviert!"}
          </Col>
          <Col span={12}>Trainings:</Col>
          <Col span={12}>{trainings?.length || "0"}</Col>
          <Col span={12}>Letztes Training:</Col>
          <Col span={12}>
            {trainings?.length
              ? dayjs(trainings[trainings?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "Noch keine Trainings absolviert!"}
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
              : "Noch nicht befördert!"}
          </Col>
          <Col span={12}>Einsätze seitdem:</Col>
          <Col span={12}>
            {user?.profile?.promotionHistory[
              user?.profile?.promotionHistory?.length - 1
            ]
              ? AttendenceCollection?.find({
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
        <Row justify="center" align="middle">
          {skillOptions?.length === 0 ? (
            <Empty description="Keine Ausbildungen für diese Ausbildungsart gefunden." />
          ) : (
            skillOptions?.map((option, index) => {
              return (
                <Col span={24} key={"option" + option.label + "-" + index}>
                  <Checkbox checked={option.value} disabled>
                    {option.label}
                  </Checkbox>
                </Col>
              );
            })
          )}
        </Row>
      ),
    },
    {
      title: "TIER-2 LEHRGÄNGE",
      children: (
        <Row justify="center" align="middle">
          {tier2Options?.length === 0 ? (
            <Empty description="Keine Ausbildungen für diese Ausbildungsart gefunden." />
          ) : (
            tier2Options?.map((option, index) => {
              return (
                <Col span={24} key={"option" + option.label + "-" + index}>
                  <Checkbox checked={option.value} disabled>
                    {option.label}
                  </Checkbox>
                </Col>
              );
            })
          )}
        </Row>
      ),
    },
    {
      title: "SPEZIALLEHRGÄNGE",
      children: (
        <Row justify="center" align="middle">
          {specialOptionsOptions?.length === 0 ? (
            <Empty description="Keine Ausbildungen für diese Ausbildungsart gefunden." />
          ) : (
            specialOptionsOptions?.map((option, index) => {
              return (
                <Col span={24} key={"option" + option.label + "-" + index}>
                  <Checkbox checked={option.value} disabled>
                    {option.label}
                  </Checkbox>
                </Col>
              );
            })
          )}
        </Row>
      ),
    },
    {
      title: "TIER-1 LEHRGÄNGE",
      children: (
        <Row justify="center" align="middle">
          {tier1Options?.length === 0 ? (
            <Empty description="Keine Ausbildungen für diese Ausbildungsart gefunden." />
          ) : (
            tier1Options?.map((option, index) => {
              return (
                <Col span={24} key={"option" + option.label + "-" + index}>
                  <Checkbox checked={option.value} disabled>
                    {option.label}
                  </Checkbox>
                </Col>
              );
            })
          )}
        </Row>
      ),
    },
  ];

  return (
    <Row
      justify={!ready ? "center" : "start"}
      align={!ready ? "middle" : "stretch"}
    >
      {!ready ? (
        <Spin spinning />
      ) : (
        cardsArray?.map((card, index) => {
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
        })
      )}
    </Row>
  );
};

export default UserDashboardComponent;
