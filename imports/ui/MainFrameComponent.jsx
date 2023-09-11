import React, { useState } from "react";
import { Button, Col, Layout, Row, Tooltip } from "antd";
import ViewController from "./ViewController";
import SidebarComponent from "./SidebarComponent";
import { Meteor } from "meteor/meteor";
import PasswordResetModal from "./PasswordResetModal";
import { LogoutOutlined, UnlockOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;
const headerStyle = {
  color: "#fff",
  height: window.innerWidth < 768 ? "auto" : 85,
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
      <Layout
        style={{
          display: !collapsed && window.innerWidth < 768 ? "none" : "block",
        }}
      >
        <Header style={headerStyle}>
          <Row justify="space-between" align="middle">
            <Col
              style={{
                fontSize: window.innerWidth < 768 ? "1.2rem" : "1.5rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              flex="auto"
            >
              {`Willkommen ${user?.profile?.name}!`}
            </Col>
            <Col>
              <Row gutter={16} align="middle">
                <Col>
                  <Button
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    type="ghost"
                    onClick={() => setOpen(true)}
                  >
                    <Tooltip title="Passwort ändern">
                      <UnlockOutlined
                        style={{ color: "#8b2929", fontSize: 32 }}
                      />
                    </Tooltip>
                  </Button>
                  <PasswordResetModal
                    open={open}
                    setOpen={setOpen}
                    userId={user?._id}
                  />
                </Col>
                <Col>
                  <Button
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    type="ghost"
                    onClick={() =>
                      Meteor.logout((err, res) => {
                        if (!err) {
                          message.success("Abmeldung erfolgreich!");
                        } else {
                          message.error("Abmeldung fehgeschlagen!");
                          console.error("Error in Meteor.logout", err, res);
                        }
                      })
                    }
                  >
                    <Tooltip title="Abmelden">
                      <LogoutOutlined
                        style={{ color: "#8b2929", fontSize: 32 }}
                      />
                    </Tooltip>
                  </Button>
                </Col>
              </Row>
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
