import {
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Layout, Row } from "antd";
import React from "react";
import HeaderComponent from "./HeaderComponent";
const siderStyle = {
  color: "#fff",
  backgroundColor: "#000",
};
import { Meteor } from "meteor/meteor";
const { Sider } = Layout;

const SidebarComponent = ({ setView, collapsed, setCollapsed }) => {
  const options = [
    {
      view: "dashboard",
      icon: <DashboardOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 8 }}>Dashboard</span>
      ),
    },
    {
      view: "members",
      icon: <UserOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 8 }}>Mitglieder</span>
      ),
    },
    {
      view: "attendence",
      icon: <CalendarOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 8 }}>Einsätze</span>
      ),
    },
  ];
  return (
    <Sider
      style={siderStyle}
      onCollapse={() => setCollapsed(!collapsed)}
      collapsedWidth={95}
      width={window.innerWidth < 768 ? "100vw" : 225}
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
          justifyContent: "center",
        }}
      >
        {options.map((option) => {
          return (
            <Col span={24} style={{ height: "5vh" }} key={option.view}>
              <Button
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: collapsed ? "center" : "flex-start",
                  alignItems: "center",
                }}
                type="ghost"
                onClick={() => {
                  setView(option.view);
                }}
              >
                {option.icon}
                {option.text}
              </Button>
            </Col>
          );
        })}
      </Row>
      <Row style={{ height: "67.8vh" }}></Row>
      <Row
        style={{
          padding: "1rem 0",
          alignItems: "end",
        }}
      >
        <Col span={24}>
          <Button
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-start",
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
            <LogoutOutlined style={{ color: "#8b2929", fontSize: 32 }} />
            {!collapsed && <span style={{ fontSize: 24 }}>Abmelden</span>}
          </Button>
        </Col>
      </Row>
    </Sider>
  );
};

export default SidebarComponent;
