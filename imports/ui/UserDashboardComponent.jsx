import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AttendenceCollection } from "../api/AttendenceApi";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import dayjs from "dayjs";
import { SquadCollection } from "../api/SquadApi";

const UserDashboardComponent = ({ userProp }) => {
  const { user, trainings, operations } = useTracker(() => {
    const user = Meteor.users.findOne(userProp?._id);
    const squadSub = Meteor.subscribe("squads");
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
      };
    }
  });

  const cardsArray = [
    {
      title: "Dienstgrad",
      children: (
        <Row>
          <Col span={8}>Name:</Col>
          <Col span={16}>{user?.profile?.name || "-"}</Col>
          <Col span={8}>Rang:</Col>
          <Col span={16}>{user?.profile?.rank || "-"}</Col>
          <Col span={8}>Trupp:</Col>
          <Col span={16}>
            {SquadCollection.findOne(user?.profile?.squad)?.squadName || "-"}
          </Col>
        </Row>
      ),
    },
    {
      title: "Ausbildungen",
      children: (
        <Tooltip title={user?.profile?.skills?.join(", ")}>
          <Statistic value={user?.profile?.skills?.length || 0} />
        </Tooltip>
      ),
    },
    {
      title: "Belohnungspunkte",
      children: <Statistic value={user?.profile?.points || 0} />,
    },
    {
      title: "Letzte Beförderung",
      children: (
        <Statistic
          value={
            user?.profile?.promotionHistory?.length
              ? dayjs(
                  user?.profile?.promotionHistory[
                    user?.profile?.promotionHistory?.length - 1
                  ]
                ).format("DD.MM.YYYY")
              : "-"
          }
        />
      ),
    },
    {
      title: "Einsätze",
      children: <Statistic value={operations?.length || 0} />,
    },
    {
      title: "Letzter Einsatz",
      children: (
        <Statistic
          value={
            operations?.length
              ? dayjs(operations[operations?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "-"
          }
        />
      ),
    },
    {
      title: "Trainings",
      children: <Statistic value={trainings?.length || 0} />,
    },
    {
      title: "Letztes Training",
      children: (
        <Statistic
          value={
            trainings?.length
              ? dayjs(trainings[trainings?.length - 1].date).format(
                  "DD.MM.YYYY"
                )
              : "-"
          }
        />
      ),
    },
  ];
  return (
    <Row>
      {cardsArray.map((card) => {
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
