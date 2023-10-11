import { Button, Col, Form, Modal, Row, Select, message } from "antd";
import React, { useState } from "react";
import { SkillsCollection } from "../../../../api/SkillsApi";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const AddSkillModal = ({ open, setOpen, title }) => {
  const [skill, setSkill] = useState(null);
  const { skillOptions, userOptions } = useTracker(() => {
    const sub = Meteor.subscribe("users", {
      "profile.status": "active",
      "profile.skills": { $ne: skill },
    });
    const skillOptions = SkillsCollection.find().map((skill) => {
      return {
        key: skill._id,
        value: skill._id,
        label: skill.name,
      };
    });
    const userOptions = Meteor.users
      .find({ "profile.status": "active", "profile.skills": { $ne: skill } })
      .map((user) => {
        return {
          key: user._id,
          value: user._id,
          label: user.profile?.name,
        };
      });
    return {
      skillOptions,
      userOptions,
      subReady: sub.ready(),
    };
  }, [skill]);
  const handleClose = () => {
    setSkill(null);
    setOpen(false);
  };
  const handleFinish = (values) => {
    Meteor.call(
      "skills.update.many",
      { ...values, skillId: skill },
      (err, res) => {
        if (!err) {
          message.success("Ausbildung wurden aktualisiert!");
          handleClose();
        } else {
          message.error("Ausbildungen konnten nicht aktualisiert werden!");
        }
      }
    );
  };
  return (
    <Modal
      open={open}
      title={title}
      onCancel={handleClose}
      footer={false}
      centered
      destroyOnClose
    >
      <Row>
        <Col span={24}>
          <Form layout="vertical" labelCol={24} onFinish={handleFinish}>
            <Form.Item
              name="skillId"
              label="Ausbildung"
              rules={[
                {
                  required: true,
                  message: "Bitte wähle eine Ausbiildung aus!",
                },
              ]}
            >
              <Select
                optionFilterProp="label"
                value={skill}
                onChange={(value) => setSkill(value)}
                options={skillOptions}
                showSearch
              />
            </Form.Item>
            <Form.Item
              name="members"
              label="Mitglieder"
              rules={[
                {
                  required: true,
                  message: "Wähle mindestens ein Mitglied aus!",
                },
              ]}
            >
              <Select
                optionFilterProp="label"
                options={userOptions}
                mode="multiple"
                placeholder={
                  !skill
                    ? "Wähle zuerst eine Ausbildung aus!"
                    : "Wähle mindestens ein Mitglied aus"
                }
                disabled={!skill}
                showSearch
              />
            </Form.Item>
            <Row justify="end" align="middle" gutter={16}>
              <Col>
                <Button onClick={handleClose}>Abbrechen</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="sumbit">
                  Speichern
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default AddSkillModal;
