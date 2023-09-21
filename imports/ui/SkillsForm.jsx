import { Badge, Form, Input, Select, Spin } from "antd";
import React from "react";
import { SkillsCollection } from "../api/SkillsApi";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const SkillsForm = ({ id, handleFormChange, handleSubmit, formDisabled }) => {
  const { skillsReady, usersReady, userOptions } = useTracker(() => {
    const sub = Meteor.subscribe("skills");
    const userSub = Meteor.subscribe("users");
    return {
      skillsReady: sub.ready(),
      usersReady: userSub.ready(),
      userOptions: Meteor.users
        .find({ "profile.status": "active" })
        .map((user) => {
          return {
            label: user?.profile?.name,
            value: user?._id,
          };
        }),
    };
  }, []);
  const defaultValues = SkillsCollection.findOne(id);
  const colors = [
    { value: "pink", label: <Badge color={"pink"} text="Pink" /> },
    { value: "red", label: <Badge color={"red"} text="Rot" /> },
    { value: "yellow", label: <Badge color={"yellow"} text="Gelb" /> },
    { value: "orange", label: <Badge color={"orange"} text="Orange" /> },
    { value: "cyan", label: <Badge color={"cyan"} text="Cyan" /> },
    { value: "green", label: <Badge color={"green"} text="Grün" /> },
    { value: "blue", label: <Badge color={"blue"} text="Blau" /> },
    { value: "purple", label: <Badge color={"purple"} text="Lila" /> },
    {
      value: "geekblue",
      label: <Badge color={"geekblue"} text="Dunkelblau" />,
    },
    { value: "magenta", label: <Badge color={"magenta"} text="Magenta" /> },
    { value: "volcano", label: <Badge color={"volcano"} text="Orange" /> },
    { value: "gold", label: <Badge color={"gold"} text="Gold" /> },
    { value: "lime", label: <Badge color={"lime"} text="Hellgrün" /> },
  ];

  return (
    <Spin spinning={!skillsReady || !usersReady}>
      <Form
        disabled={formDisabled}
        layout="vertical"
        labelCol={24}
        onValuesChange={(_, values) => handleFormChange(values)}
        onFinish={() => handleSubmit()}
        initialValues={defaultValues}
      >
        <Form.Item
          label="Ausbildungsname"
          name="name"
          rules={[
            {
              required: true,
              message: "Bitte trage einen Namen ein!",
            },
          ]}
        >
          <Input name="name" />
        </Form.Item>
        <Form.Item label="Ausbilder" name="trainers">
          <Select name="trainers" mode="multiple" options={userOptions} />
        </Form.Item>
        <Form.Item label="Farbe" name="color">
          <Select name="color" options={colors} />
        </Form.Item>
        <Form.Item label="Download-Link" name="link">
          <Input name="link" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SkillsForm;