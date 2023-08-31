import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AttendenceCollection } from "../api/AttendenceApi";
import { Card, Col, Row, Statistic } from "antd";

const UserDashboardComponent = ({ userProp }) => {
  const { user, trainings, operations } = useTracker(() => {
    const user = Meteor.users.findOne(userProp?._id);
    const sub = Meteor.subscribe("attendence.by.user", user?._id);
    if (sub.ready()) {
      return {
        user,
        trainings: AttendenceCollection.find({ type: "training" }).count(),
        operations: AttendenceCollection.find({ type: "mission" }).count(),
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
          <Col span={16}>{user?.profile?.squad || "-"}</Col>
        </Row>
      ),
    },
    {
      title: "Belohnungspunkte",
      children: <Statistic value={user?.profile?.points || 0} />,
    },
    {
      title: "Trainings",
      children: <Statistic value={trainings || 0} />,
    },
    {
      title: "Einsätze",
      children: <Statistic value={operations || 0} />,
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
              style={{ height: "100%" }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default UserDashboardComponent;
