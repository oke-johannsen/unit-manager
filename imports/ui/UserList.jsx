import { Col, List, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";

const UserList = ({ dataSource }) => {
  return (
    <List
      dataSource={dataSource}
      style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
      renderItem={(item) => {
        const user = Meteor.users.findOne(item);
        return (
          <Row style={{ width: "100%" }}>
            {user?.profile?.rank && <Col span={6}>{user?.profile?.rank}:</Col>}
            <Col flex="auto">{user?.profile?.name}</Col>
          </Row>
        );
      }}
    />
  );
};

export default UserList;
