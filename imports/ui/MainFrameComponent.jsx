import React, { useState } from "react";
import { Button, Col, Layout, Row, message } from "antd";
import { Meteor } from "meteor/meteor";
import HeaderComponent from "./HeaderComponent";
import { LogoutOutlined } from "@ant-design/icons";
const { Header, Footer, Sider, Content } = Layout;

const MainFrameComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const headerStyle = {
    color: "#fff",
    height: 85,
    paddingInline: 0,
    lineHeight: "85px",
    backgroundColor: "#000",
  };
  const contentStyle = {
    color: "#fff",
    backgroundColor: "#000",
  };
  const siderStyle = {
    color: "#fff",
    backgroundColor: "#000",
  };
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#000",
  };
  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        style={siderStyle}
        onCollapse={() => setCollapsed(!collapsed)}
        collapsedWidth={95}
        width={window.innerWidth < 768 ? "100vw" : "25vw"}
        collapsed={collapsed}
        collapsible
      >
        <Row justify="center">
          <Col>
            <HeaderComponent />
          </Col>
        </Row>
        <Row
          style={{
            height: "calc(100vh - 221px)",
            justifyContent: "center",
            alignItems: "end",
          }}
        ></Row>
        <Row
          style={{
            padding: "1rem 0",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <Col>
            <Button
              style={{ height: "100%" }}
              type="ghost"
              onClick={() =>
                Meteor.logout((err, res) => {
                  if (!err) {
                    message.success("Abmedlung erfolgreich!");
                  } else {
                    message.error("Abmeldung fehgeschlagen!");
                    console.error("Error in Meteor.logout", err, res);
                  }
                })
              }
            >
              <LogoutOutlined style={{ color: "#8b2929", fontSize: 32 }} />
            </Button>
          </Col>
        </Row>
      </Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>Content</Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default MainFrameComponent;
