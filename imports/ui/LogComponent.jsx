import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { LoggingCollection } from "../api/LoggingApi";
import { Col, DatePicker, Row, Spin, Table } from "antd";
import { LOG_COLUMNS } from "./LOG_COLUMNS";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const LogComponent = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const { ready, loggings } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    const subLogging = Meteor.subscribe("logging");
    const loggings = LoggingCollection.find(
      dateRange
        ? {
            timestamp: {
              $gte: dateRange[0].toDate(),
              $lte: dateRange[1].toDate(),
            },
          }
        : {},
      { sort: { timestamp: -1 } }
    ).map((item) => {
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
  }, [dateRange]);
  return (
    <Row align="middle">
      <Col span={24}>
        <Spin spinning={!ready}>
          <Table
            title={() => (
              <Row justify="space-between" align="middle">
                <Col>
                  <span
                    style={{
                      margin: "0 1.5rem 0 0",
                      padding: 0,
                      fontSize: 24,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    LOGS
                  </span>
                </Col>
                <Col>
                  <RangePicker
                    format="DD.MM.YYYY"
                    onChange={setDateRange}
                    value={dateRange}
                    placeholder={["Start", "Ende"]}
                  />
                </Col>
              </Row>
            )}
            style={{ padding: "0.5rem" }}
            dataSource={loggings}
            columns={LOG_COLUMNS}
            pagination={
              loggings?.length > 10
                ? {
                    pageSize: 10,
                    responsive: true,
                    showTotal: () => (
                      <span>{`Insgegsamt: ${loggings.length} Logs`}</span>
                    ),
                    showSizeChanger: false,
                  }
                : false
            }
          />
        </Spin>
      </Col>
    </Row>
  );
};

export default LogComponent;
