import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Tooltip,
  message,
} from "antd";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const RecruitingModal = ({ open, setOpen }) => {
  const { usersReady, members } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    const members = Meteor.users
      .find({ "profile.status": "active" }, { $sort: { "profile.name": 1 } })
      .map((user) => {
        return {
          key: user._id,
          value: user._id,
          label: user.profile?.name,
        };
      });
    return {
      usersReady: sub.ready(),
      members,
    };
  }, []);
  const [wasReferred, setWasReferred] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const steamIdHelpText = (
    <Row gutter={[8, 8]}>
      <Col span={24}>1. Öffne dein Steam-Profil</Col>
      <Col span={24}>2. Klicke auf Profil bearbeiten</Col>
      <Col span={24}>
        3. Wenn du noch keine individuelle Steam-Community-URL für deinen
        Account festgelegt hast, wird unter Profil-URL deine Steam-ID wie folgt
        angezeigt: „76561198#########”.
      </Col>
    </Row>
  );
  const handleFinish = (values) => {
    Meteor.call("recruitment.create", values, (err, res) => {
      if (!err) {
        message.success("Deine Bewerbung wurde erfolgreich eingereicht!");
        setOpen(false);
      } else {
      }
    });
  };
  const handleFinishFailed = (errorInfo) => {
    console.warn("handleFinishFailed", errorInfo);
    message.warning("Bitte fülle alle Pflichtfelder aus!");
  };
  return (
    <Modal
      open={open}
      width="70vw"
      title="Jetzt bewerben"
      footer={false}
      onCancel={() => setOpen(false)}
      closable
      destroyOnClose
    >
      <Spin spinning={!usersReady}>
        <Form
          labelCol={24}
          layout="vertical"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Row gutter={8} align="bottom">
            <Col xs={24} md={12}>
              <Form.Item
                name="age"
                label="Wie alt bist du?"
                rules={[
                  { required: true, message: "Bitte trage dein Alter ein!" },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="amountOfHours"
                label="Wie viele Spielstunden hast du in ArmA III?"
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="experience"
            label={
              <Tooltip
                title="MilSim, eine Abkürzung für Militärsimulation, bezieht sich auf die Simulation von bewaffneten Konflikten unter realistischen Bedingungen."
                trigger={["click"]}
                placement="right"
              >
                Wie beschreibst du deine bisherhige MilSim Erfahrung?{" "}
                <a>
                  <InfoCircleOutlined />
                </a>
              </Tooltip>
            }
          >
            <Input.TextArea style={{ width: "100%" }} />
          </Form.Item>
          <Row className={wasReferred ? "ant-form-item ant-form-item-row" : ""}>
            <Col
              span={24}
              className={wasReferred ? "ant-form-item-label" : ""}
              style={{ marginBottom: wasReferred ? 0 : 8 }}
            >
              <label
                htmlFor="referred"
                className={wasReferred ? "ant-form-item-required" : ""}
              >
                Wurdest du von einem Mitglied aus der Einheit angeworben und
                wenn ja, von wem?
              </label>
            </Col>
            <Col span={24}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="referred"
                    style={{ marginBottom: wasReferred ? 0 : 24 }}
                  >
                    <Switch checked={wasReferred} onChange={setWasReferred} />
                  </Form.Item>
                </Col>
                {wasReferred && (
                  <Col span={12} flex="auto">
                    <Form.Item
                      name="referrer"
                      rules={[
                        {
                          required: true,
                          message: "Bitte wähle ein Mitglied aus!",
                        },
                      ]}
                      style={{ marginBottom: wasReferred ? 0 : 24 }}
                    >
                      <Select
                        options={members || []}
                        optionFilterProp="label"
                        showSearch
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
          <Form.Item
            name="attendenceBehaviour"
            label="Kannst du eine überwiegende Anwesenheit garantieren und bist bereit an Trainings abseits der Missionen teilzunehmen?"
          >
            <Input.TextArea style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="preferredName"
            label={
              <Tooltip
                title='Der Name muss einen Vor- und Nachnamen enthaltet, welcher "realistisch" sein soll (deutsche Namen sind nicht verpflichtend aber gewünscht)'
                trigger={["click"]}
                placement="right"
              >
                Wie möchtest du in der Einheit heißen?{" "}
                <a>
                  <InfoCircleOutlined />
                </a>
              </Tooltip>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discordId"
            label="Discord-ID bzw. Benutzername"
            rules={[
              {
                required: true,
                message:
                  "Bitte trage deine/n Discord-ID bzw. Benutzername ein!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="steamProfile"
            label={
              <Tooltip
                title={steamIdHelpText}
                trigger={["click"]}
                placement="right"
              >
                Steam-ID bzw. Profil-Link{" "}
                <a>
                  <InfoCircleOutlined />
                </a>
              </Tooltip>
            }
            rules={[
              {
                required: true,
                message: "Bitte trage deine/n Steam-ID bzw. Profil-Link ein!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={[8, 8]} justify="space-between" align="middle">
            <Col span={24}>
              Hast du unsere{" "}
              <a
                href="https://www.taskforce11.de/regelhandbuch"
                target="_blank"
              >
                Regeln
              </a>{" "}
              gelesen und akzeptierst diese?
            </Col>
            <Col span={24}>
              <Row gutter={16}>
                <Col>
                  <Radio.Group
                    value={rulesAccepted}
                    onChange={(e) => setRulesAccepted(e.target.value)}
                    options={[
                      {
                        key: "accept",
                        value: true,
                        label: "Akzeptieren",
                      },
                      { key: "reject", value: false, label: "Ablehnen" },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16} justify="end">
            <Col>
              <Button
                onClick={() => setOpen(false)}
                style={{ paddingInline: "1rem" }}
              >
                Abbrechen
              </Button>
            </Col>
            <Col>
              <Button
                htmlType="submit"
                disabled={!rulesAccepted}
                type="primary"
                style={{ paddingInline: "1rem" }}
              >
                Absenden
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default RecruitingModal;
