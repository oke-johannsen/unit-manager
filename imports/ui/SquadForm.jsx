import { Form, Input, Select, Spin } from "antd";
import React from "react";
import { SquadCollection } from "../api/SquadApi";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const SquadForm = ({ id, handleFormChange, handleSubmit, formDisabled }) => {
  const { squadsReady, usersReady, userOptions } = useTracker(() => {
    const sub = Meteor.subscribe("squads");
    const userSub = Meteor.subscribe("users");
    return {
      squadsReady: sub.ready(),
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
  const defaultValues = {
    designation: "KSK",
  };

  return (
    <Spin spinning={!squadsReady || !usersReady}>
      <Form
        disabled={formDisabled}
        layout="vertical"
        labelCol={24}
        onValuesChange={(_, values) => handleFormChange(values)}
        onFinish={() => handleSubmit()}
        initialValues={SquadCollection.findOne(id) || defaultValues}
      >
        <Form.Item
          label="Truppname"
          name="squadName"
          rules={[
            {
              required: true,
              message: "Bitte trage einen Truppnamen ein!",
            },
          ]}
        >
          <Input name="squadName" />
        </Form.Item>
        <Form.Item label="Zugehörigkeit" name="designation">
          <Select
            name="designation"
            options={[
              {
                label: "KSK",
                value: "KSK",
              },
              {
                label: "Luftwaffe",
                value: "Luftwaffe",
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Truppmitglieder" name="squadMember">
          <Select name="squadMember" mode="multiple" options={userOptions} />
        </Form.Item>
        <Form.Item label="Truppführung" name="squadLead">
          <Select name="squadLead" options={userOptions} />
        </Form.Item>
        <Form.Item label="Spezialisierung" name="speciality">
          <Input.TextArea
            name="speciality"
            style={{ width: "100%", minHeight: "7.5vh" }}
          />
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SquadForm;
