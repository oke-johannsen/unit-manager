import React, { useState } from "react";
import { Button, Col, Layout, Row, Tooltip } from "antd";
import { Meteor } from "meteor/meteor";
import { LogoutOutlined, UnlockOutlined } from "@ant-design/icons";
import ViewController from "./ViewController";
import PasswordResetModal from "./PasswordResetModal";
import SidebarComponent from "./SidebarComponent";
const { Header, Content, Footer } = Layout;

const MainFrameComponent = () => {
  const [view, setView] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const user = Meteor.user();
  const headerStyle = {
    height: window.innerWidth < 768 ? "auto" : 90,
    lineHeight: "90px",
    paddingInline: "0.5rem",
  };
  const contentStyle = {
    color: "#d1d1d1",
    padding: "32px 16px",
    height: "calc(100% - 90px)",
    overflowY: "auto",
  };
  const footerStyle = {
    textAlign: "center",
  };
  return (
    <Layout style={{ height: "100%" }}>
      <SidebarComponent setView={setView} />
      <Layout>
        <Header style={headerStyle}>
          <Row justify="space-between" align="middle" style={{ height: 80 }}>
            {window.innerWidth > 700 && (
              <Col
                className="layer-2"
                style={{
                  fontSize: window.innerWidth < 768 ? "1.2rem" : "1.5rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                flex="auto"
              >
                {`Willkommen, ${user?.profile?.name}!`}
              </Col>
            )}
            <Col className="layer-2" span={window.innerWidth > 700 ? null : 24}>
              <Row gutter={16} justify="end" align="middle">
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
                    <Tooltip title="Passwort ändern" className="layer-2">
                      <UnlockOutlined
                        style={{ color: "#D1D1D1", fontSize: 32 }}
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
                    <Tooltip title="Abmelden" className="layer-2">
                      <LogoutOutlined
                        style={{ color: "#D1D1D1", fontSize: 32 }}
                      />
                    </Tooltip>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content style={contentStyle}>
          <ViewController view={view} setView={setView} />
        </Content>
        {window.innerWidth > 700 && (
          <Footer style={footerStyle}>
            <Row gutter={16} justify="end" align="bottom">
              <Col>
                <a
                  href="http://steamcommunity.com/groups/TaskForce-11"
                  target="_blank"
                >
                  Steam Gruppe
                </a>
              </Col>
              <Col>
                <a
                  href="https://units.arma3.com/unit/taskforce11"
                  target="_blank"
                >
                  Arma 3 Unit
                </a>
              </Col>
              <Col>
                <a href="ts3server://ts.TaskForce11.de" target="_blank">
                  TeamSpeak
                </a>
              </Col>
              <Col>
                <a href="https://discord.gg/74cPDMcyaU" target="_blank">
                  Discord
                </a>
              </Col>
              <Col>|</Col>
              <Col>
                <a href="https://www.taskforce11.de/" target="_blank">
                  Task Force 11 <sup>TM</sup>
                </a>
              </Col>
            </Row>
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default MainFrameComponent;
