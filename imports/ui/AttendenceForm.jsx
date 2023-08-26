import { Col, DatePicker, Form, Row, Select, Spin } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const AttendenceForm = ({ type, form, setForm }) => {
  const { userOptions } = useTracker(() => {
    return {
      userOptions: Meteor.users
        .find({ "profile.status": "active" })
        .map((user) => {
          return {
            key: user._id,
            value: user._id,
            label: user.profile?.name,
          };
        }),
    };
  }, []);
  const [userIds, setUserIds] = useState([]);
  let render;
  const formDefaults = form;
  const typeOptions = [
    {
      key: "mission",
      value: "mission",
      label: "Mission",
    },
    {
      key: "training",
      value: "training",
      label: "Training",
    },
  ];
  switch (type) {
    case "insert":
      render = (
        <Form
          initialValues={formDefaults}
          layout="vertical"
          labelCol={24}
          onValuesChange={(_, allValues) => setForm(allValues)}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label="Einsatzart"
                name="type"
                rules={[{ required: true }]}
              >
                <Select options={typeOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Datum" name="date" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder=""
                  format="DD.MM.YYYY"
                  allowClear={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Teilnehmer"
            name="userIds"
            rules={[{ required: true, message: "Bitte wähle Teilnehmer aus!" }]}
          >
            <Select
              mode="multiple"
              value={userIds}
              onChange={setUserIds}
              options={userOptions}
            />
          </Form.Item>
          <Form.Item label="Beförderte Mitglieder" name="promotedMembers">
            <Select
              mode="multiple"
              disabled={userIds?.length === 0}
              placeholder={
                userIds?.length === 0 ? "Zuerst Teilnehmer auswählen" : ""
              }
              options={userOptions?.filter((option) =>
                userIds.includes(option.key)
              )}
            />
          </Form.Item>
        </Form>
      );
      break;
    case "update":
      render = <>update</>;
      break;
    case "delete":
      render = <>delete</>;
      break;
    case "display":
      render = <>display</>;
      break;
    default:
      render = <></>;
      break;
  }
  return <Spin spinning={!userOptions}>{render}</Spin>;
};

export default AttendenceForm;
