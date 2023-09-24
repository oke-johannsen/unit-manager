import { Col, DatePicker, Form, Input, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const AttendenceForm = ({ type, form, setForm, disabled, activeKey }) => {
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
  let render;
  const formDefaults = activeKey
    ? form?.filter((item) => item._id === activeKey)[0]
    : form;
  const [userIds, setUserIds] = useState(
    (activeKey
      ? form?.filter((item) => item._id === activeKey)[0]?.userIds
      : form.userIds) || []
  );
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
  const handleValuesChange = (allValues) => {
    if (type === "update") {
      const tempForm = [...form];
      const newForm = tempForm.map((item) => {
        if (item._id === allValues._id) {
          return allValues;
        } else {
          return item;
        }
      });
      setForm(newForm);
    } else {
      setForm(allValues);
    }
  };
  useEffect(() => {
    if (type === "update") {
      const data = form.filter((item) => item._id === activeKey)[0];
      data.promotedMembers.forEach((userId, index) => {
        if (!data.userIds.includes(userId)) {
          data.promotedMembers.splice(index, 1);
        }
      });
      const newForm = form.map((item) => {
        return item._id === activeKey ? data : item;
      });
      setForm(newForm);
    }
  }, [userIds]);
  const formComponent = (
    <Form
      initialValues={formDefaults}
      layout="vertical"
      labelCol={24}
      onValuesChange={(_, allValues) => handleValuesChange(allValues)}
      disabled={disabled}
    >
      <Row gutter={8}>
        <Form.Item label="id" name="_id" hidden>
          <Input />
        </Form.Item>
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
          disabled={disabled || userIds?.length === 0}
          placeholder={
            userIds?.length === 0 ? "Zuerst Teilnehmer auswählen" : ""
          }
          options={userOptions?.filter((option) =>
            userIds?.includes(option.key)
          )}
        />
      </Form.Item>
    </Form>
  );
  switch (type) {
    case "insert":
    case "display":
      render = formComponent;
      break;
    case "delete":
      render = <>delete</>;
      break;
    case "update":
      render = formComponent;
      break;
    default:
      render = <></>;
      break;
  }
  return <Spin spinning={!userOptions}>{render}</Spin>;
};

export default AttendenceForm;
