import {
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
} from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { SkillsCollection } from "../../../../api/SkillsApi";
import { SquadCollection } from "../../../../api/SquadApi";

const PASSWORD_PATTER =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\*\.\-!"§\$%&\*+#':;<>@\d]).{8,}$/;

const rankOptions = [
  { value: "Unteroffizier", label: "Unteroffizier" },
  { value: "Feldwebel", label: "Feldwebel" },
  { value: "Oberbootsmann", label: "Oberbootsmann" },
  { value: "Oberfeldwebel", label: "Oberfeldwebel" },
  { value: "Hauptbootsmann", label: "Hauptbootsmann" },
  { value: "Hauptfeldwebel", label: "Hauptfeldwebel" },
  { value: "Stabsbootsmann", label: "Stabsbootsmann" },
  { value: "Stabsfeldwebel", label: "Stabsfeldwebel" },
  { value: "Oberstabsbootsmann", label: "Oberstabsbootsmann" },
  { value: "Oberstabsfeldwebel", label: "Oberstabsfeldwebel" },
  { value: "Leutnant zur See", label: "Leutnant zur See" },
  { value: "Leutnant", label: "Leutnant" },
  { value: "Oberleutnant zur See", label: "Oberleutnant zur See" },
  { value: "Oberleutnant", label: "Oberleutnant" },
  { value: "Kapitänleutnant", label: "Kapitänleutnant" },
  { value: "Hauptmann", label: "Hauptmann" },
  { value: "Major", label: "Major" },
];

const UserForm = ({ userId, closeModal, forms, setForms, submitForms }) => {
  const { skillsOptions, squadOptions } = useTracker(() => {
    Meteor.subscribe("skills");
    return {
      skillsOptions: SkillsCollection.find().map((skill) => {
        return {
          value: skill._id,
          label: (
            <span>
              <Badge color={skill.color || "#ccc"} /> {skill.name}
            </span>
          ),
          name: skill.name,
          color: skill.color || "#ccc",
        };
      }),
      squadOptions: SquadCollection.find().map((squad) => {
        return {
          value: squad._id,
          label: squad.squadName,
        };
      }),
    };
  }, []);
  const onFinish = () => {
    submitForms(forms);
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };
  const user = Meteor.users.findOne(userId);
  const userData = user
    ? {
        ...user,
        ...user.profile,
      }
    : {
        username: undefined,
        password: undefined,
        name: undefined,
        tier: 3,
        rank: "Unteroffizier",
        designation: "KSK",
        squadPosition: "Mannschafter",
        securityClearance: 1,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
      };

  const checkUsernameForDuplicate = async (_, username) => {
    const activeUser = Meteor.users.findOne(userId);
    if (activeUser?.username === username) {
      await Promise.resolve();
    } else {
      const user = Meteor.users.findOne({ username });
      if (user) {
        await Promise.reject(new Error(`${username} wird bereits verwendet!`));
      } else {
        await Promise.resolve();
      }
    }
  };

  const tagRender = (item) => {
    const skill = skillsOptions?.filter(
      (option) => option.value === item.value
    )[0];
    return skill ? (
      <Tag color={skill?.color} value={skill?.value}>
        {skill?.name}
      </Tag>
    ) : (
      item?.value
    );
  };

  const securityClearance = Meteor.user()?.profile?.securityClearance;
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
      onValuesChange={(_changedValues, allValues) => {
        const data = { ...forms };
        data[userId || "new"] = allValues;
        setForms(data);
      }}
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
          {
            validator: checkUsernameForDuplicate,
          },
        ]}
      >
        <Input autoComplete="username" disabled={securityClearance < 4} />
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
            {
              min: 6,
              message: "Dein Passwort muss aus mindestens 6 Zeichen bestehen!",
            },
            {
              pattern: PASSWORD_PATTER,
              message:
                "Das Passwort muss aus min. 1 Großbuchstaben, 1 Kleinbuchstaben, 1 Sonderzeichen und 1 Zahl bestehen!",
            },
          ]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
      )}

      <Divider>Stammdaten</Divider>

      <Row gutter={8}>
        <Col lg={12} md={24}>
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
            <Input disabled={securityClearance < 3} />
          </Form.Item>
        </Col>
        <Col lg={12} md={24}>
          <Form.Item label="Tier" name="tier">
            <Select
              disabled={securityClearance < 3}
              optionFilterProp="label"
              showSearch
            >
              <Select.Option value={3}>3</Select.Option>
              <Select.Option value={2}>2</Select.Option>
              <Select.Option value={1}>1</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col lg={12} md={24}>
          <Form.Item label="Zugehörigkeit" name="designation">
            <Select
              disabled={securityClearance < 3}
              optionFilterProp="label"
              showSearch
            >
              <Select.Option value="KSK">KSK</Select.Option>
              <Select.Option value="KSM">KSM</Select.Option>
              <Select.Option value="Luftwaffe">Luftwaffe</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={24}>
          <Form.Item
            label="Dienstgrad"
            name="rank"
            optionFilterProp="label"
            showSearch
          >
            <Select disabled={securityClearance < 3} options={rankOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col lg={12} md={24}>
          <Form.Item label="Trupp" name="squad">
            <Select
              disabled={securityClearance < 3}
              options={squadOptions || []}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col lg={12} md={24}>
          <Form.Item label="Trupp-Position" name="squadPosition">
            <Select
              disabled={securityClearance < 3}
              optionFilterProp="label"
              showSearch
            >
              <Select.Option value="Mannschaft">Mannschafter</Select.Option>
              <Select.Option value="Stv. Truppführer">
                Stv. Truppführer
              </Select.Option>
              <Select.Option value="Truppführer">Truppführer</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>Organisatorisches</Divider>

      <Form.Item label="Ausbildungen" name="skills">
        <Select
          optionFilterProp="label"
          showSearch
          mode="multiple"
          tagRender={tagRender}
          options={skillsOptions || []}
          disabled={securityClearance < 2}
        />
      </Form.Item>

      <Form.Item label="Sicherheitsstufe" name="securityClearance">
        <Select
          disabled={securityClearance < 4}
          optionFilterProp="label"
          showSearch
        >
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
          <Select.Option value="4">4</Select.Option>
        </Select>
      </Form.Item>

      <Row gutter={8}>
        <Col lg={12} md={24}>
          <Form.Item label="Belohnungspunkte" name="points">
            <InputNumber
              style={{ width: "100%" }}
              disabled={securityClearance < 4}
            />
          </Form.Item>
        </Col>
        <Col lg={12} md={24}>
          <Form.Item label="Inaktivitätspunkte" name="inactivityPoints">
            <InputNumber
              style={{ width: "100%" }}
              disabled={securityClearance < 3}
            />
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
