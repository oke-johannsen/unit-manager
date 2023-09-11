import {
  AppstoreOutlined,
  AuditOutlined,
  CalendarOutlined,
  TeamOutlined,
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
      icon: <AppstoreOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 2 }}>Dashboard</span>
      ),
    },
    {
      view: "squads",
      icon: <TeamOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 2 }}>Trupps</span>
      ),
    },
    {
      view: "members",
      icon: <UserOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 2 }}>Mitglieder</span>
      ),
    },
    {
      view: "attendence",
      icon: <CalendarOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 2 }}>Einsätze</span>
      ),
    },
    Meteor.user()?.profile?.securityClearance > 2 && {
      view: "recruitment",
      icon: <AuditOutlined style={{ fontSize: 32, color: "#8b2929" }} />,
      text: !collapsed && (
        <span style={{ fontSize: 24, paddingBottom: 2 }}>Bewerbungen</span>
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
      <Row gutter={[0, 16]} justify="center" align="top">
        <Col>
          <HeaderComponent />
        </Col>
        <Col span={24}>
          <Row gutter={[0, 16]}>
            {options.map((option) => {
              return (
                <Col span={24} key={option.view}>
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
        </Col>
      </Row>
    </Sider>
  );
};

export default SidebarComponent;
