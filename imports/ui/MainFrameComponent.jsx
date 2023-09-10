import React, { useState } from "react";
import { Button, Col, Layout, Row } from "antd";
import ViewController from "./ViewController";
import SidebarComponent from "./SidebarComponent";
import { Meteor } from "meteor/meteor";
import PasswordResetModal from "./PasswordResetModal";
const { Header, Content, Footer } = Layout;
const headerStyle = {
  color: "#fff",
  height: 85,
  lineHeight: "85px",
  backgroundColor: "#000",
  paddingInline: "0.5rem",
};
const contentStyle = {
  color: "#fff",
  backgroundColor: "#000",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#000",
};

const MainFrameComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [view, setView] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const user = Meteor.user();
  return (
    <Layout style={{ height: "100%" }}>
      <SidebarComponent
        setView={setView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Layout>
        <Header style={headerStyle}>
          <Row justify="space-between">
            <Col style={{ fontSize: 24 }}>
              Willkommen {user?.profile?.name}!
            </Col>
            <Col>
              <Button type="default" onClick={() => setOpen(true)}>
                Passwort ändern
              </Button>
              <PasswordResetModal
                open={open}
                setOpen={setOpen}
                userId={user?._id}
              />
            </Col>
          </Row>
        </Header>
        <Content style={contentStyle}>
          <ViewController view={view} />
        </Content>
        <Footer style={footerStyle}></Footer>
      </Layout>
    </Layout>
  );
};

export default MainFrameComponent;
