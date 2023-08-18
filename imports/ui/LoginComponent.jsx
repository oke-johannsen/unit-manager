import { Col, Row, Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

const LoginComponent = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Row justify="center" align="middle" style={{ height: "60%" }}>
      <Col
        span={12}
        style={{
          padding: "2rem",
          border: "1px solid grey",
          borderRadius: 8,
          background: "#000",
        }}
      >
        <Typography>
          <h3>Task Force 11 - Einheitsverwaltung</h3>
        </Typography>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Bitte Benutzernamen eingeben!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Benutzername"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Bitte Passwort eingeben!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Passwort"
            />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle" gutter={8}>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Anmelden
                </Button>
              </Col>
              <Col flex="auto">
                Oder <a href="">jetzt bewerben!</a>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginComponent;
