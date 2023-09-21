import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { LoggingCollection } from "../api/LoggingApi";
import { Col, Row, Spin, Table } from "antd";
import { LOG_COLUMNS } from "./LOG_COLUMNS";

const LogComponent = () => {
  const { ready, loggings } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    const subLogging = Meteor.subscribe("logging");
    const loggings = LoggingCollection.find({}).map((item) => {
      return {
        ...item,
        key: item?._id,
        operation: item.key,
      };
    });
    return {
      ready: sub.ready() && subLogging.ready(),
      loggings,
    };
  }, []);
  return (
    <Row align="middle">
      <Col span={24}>
        <Spin spinning={!ready}>
          <Table
            style={{ padding: "0.5rem" }}
            dataSource={loggings}
            columns={LOG_COLUMNS}
            pagination={loggings?.length > 10 ? { pageSize: 10 } : false}
          />
        </Spin>
      </Col>
    </Row>
  );
};

export default LogComponent;
