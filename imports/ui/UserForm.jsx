import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";

const UserForm = ({ userId, closeModal }) => {
  const onFinish = (values) => {
    console.log("Success:", values);
    const payload = {
      ...userData,
      ...values,
      _id: userId,
    };
    Meteor.call(
      `users.${userId ? "update" : "create"}`,
      payload,
      (err, res) => {
        if (!err) {
          message.success(
            `Mitglied erfolgreich ${userId ? "aktualisert" : "angelegt"}!`
          );
          closeModal();
        } else {
          console.error(`Error in ${userId ? "update" : "create"}`, err, res);
          message.error(
            `${
              userId ? "Aktualisieren" : "Anlegen"
            } von Mitglied fehlgeschlagen!`
          );
        }
      }
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };
  const user = Meteor.users.findOne(userId);
  const userData = user
    ? {
        ...user,
        ...user.profile,
        email: user?.emails[0]?.address,
      }
    : {
        username: undefined,
        email: undefined,
        password: undefined,
        name: undefined,
        tier: 3,
        rank: "Unteroffizier",
        designation: "KSK",
        squad: "Anwärter",
        squadPosition: "Mannschaft",
        securityClearance: 0,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
      };
  return (
    <Form
      layout="vertical"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={userData}
    >
      <Divider>Account</Divider>
      <Form.Item
        label="Benutzername"
        name="username"
        rules={[
          {
            required: true,
            message: "Bitte Benutzernamen eintragen!",
          },
        ]}
      >
        <Input autoComplete="username" />
      </Form.Item>

      <Form.Item
        label="E-Mail"
        name="email"
        rules={[
          {
            message: "Bitte E-Mail eintragen!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {!userId && (
        <Form.Item
          label="Passwort"
          name="password"
          rules={[
            {
              required: true,
              message: "Bitte Passwort eintragen!",
            },
          ]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
      )}

      <Divider>Stammdaten</Divider>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Bitte Namen eintragen!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tier" name="tier">
            <Select>
              <Select.Option value={3}>3</Select.Option>
              <Select.Option value={2}>2</Select.Option>
              <Select.Option value={1}>1</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item label="Zugehörigkeit" name="designation">
            <Select>
              <Select.Option value="KSK">KSK</Select.Option>
              <Select.Option value="KSM">KSM</Select.Option>
              <Select.Option value="Luftwaffe">Luftwaffe</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Dienstgrad" name="rank">
            <Select>
              <Select.Option value="Unteroffizier">Unteroffizier</Select.Option>
              <Select.Option value="Bootsmann">Bootsmann</Select.Option>
              <Select.Option value="Feldwebel">Feldwebel</Select.Option>
              <Select.Option value="Oberbootsmann">Oberbootsmann</Select.Option>
              <Select.Option value="Oberfeldwebel">Oberfeldwebel</Select.Option>
              <Select.Option value="Hauptfeldwebel">
                Hauptfeldwebel
              </Select.Option>
              <Select.Option value="Stabsbootsmann">
                Stabsbootsmann
              </Select.Option>
              <Select.Option value="Stabsfeldwebel">
                Stabsfeldwebel
              </Select.Option>
              <Select.Option value="Oberstabsbootsmann">
                Oberstabsbootsmann
              </Select.Option>
              <Select.Option value="Oberstabsfeldwebel">
                Oberstabsfeldwebel
              </Select.Option>
              <Select.Option value="Leutnant zur See">
                Leutnant zur See
              </Select.Option>
              <Select.Option value="Leutnant">Leutnant</Select.Option>
              <Select.Option value="Oberleutnant zur See">
                Oberleutnant zur See
              </Select.Option>
              <Select.Option value="Oberleutnant">Oberleutnant</Select.Option>
              <Select.Option value="Kapitänleutnant">
                Kapitänleutnant
              </Select.Option>
              <Select.Option value="Hauptmann">Hauptmann</Select.Option>
              <Select.Option value="Major">Major</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item label="Trupp" name="squad">
            <Select>
              <Select.Option value="Anwärter">Anwärter</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trupp-Position" name="squadPosition">
            <Select>
              <Select.Option value="Mannschaft">Mannschaft</Select.Option>
              <Select.Option value="Stv. Truppführer">
                Stv. Truppführer
              </Select.Option>
              <Select.Option value="Truppführer">Truppführer</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>Organisatorisches</Divider>

      <Form.Item label="Sicherheitsstufe" name="securityClearance">
        <Select>
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
          <Select.Option value="4">4</Select.Option>
        </Select>
      </Form.Item>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item label="Belohnungspunkte" name="points">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Inaktivitätspunkte" name="inactivityPoints">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end" gutter={8} align="middle">
        <Col>
          <Button onClick={() => closeModal()}>Abbrechen</Button>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">
            Speichern
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
