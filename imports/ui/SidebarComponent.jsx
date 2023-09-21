import { AppstoreFilled } from "@ant-design/icons";
import { Button, Col, Divider, Layout, Row } from "antd";
import React from "react";
import HeaderComponent from "./HeaderComponent";
import { Meteor } from "meteor/meteor";
import AUSBILDER_SVG from "./AUSBILDER_SVG";
import MEMBER_SVG from "./MEMBER_SVG";
import TRUPPS_SVG from "./TRUPPS_SVG";
import BEWERBUNGEN_SVG from "./BEWERBUNGEN_SVG";
import EINSÄTZE_SVG from "./EINSÄTZE_SVG";
const { Sider } = Layout;

const SidebarComponent = ({ setView }) => {
  const siderStyle = {
    color: "#d1d1d1",
  };
  const options = [
    {
      view: "dashboard",
      icon: <AppstoreFilled style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          DASHBOARD
        </span>
      ),
      color: "#5f1d1d",
    },
    {
      view: "members",
      icon: <MEMBER_SVG style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          MITGLIEDER
        </span>
      ),
      color: "#698eae",
    },
    {
      view: "squads",
      icon: <TRUPPS_SVG style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          TRUPPS
        </span>
      ),
      color: "#323232",
    },
    {
      view: "attendence",
      icon: <EINSÄTZE_SVG style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          EINSÄTZE
        </span>
      ),
      color: "#4a873b",
    },
    Meteor.user()?.profile?.securityClearance > 2 && {
      view: "recruitment",
      icon: <BEWERBUNGEN_SVG style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          BEWERBUNGEN
        </span>
      ),
      color: "#545a83",
    },
    Meteor.user()?.profile?.securityClearance > 2 && {
      view: "trainers",
      icon: <AUSBILDER_SVG style={{ fontSize: 48, color: "inherit" }} />,
      text: (
        <span
          style={{
            fontSize: 18,
            fontFamily: "'Bebas Neue', sans-serif",
            color: "inherit",
          }}
        >
          AUSBILDUNGEN
        </span>
      ),
      color: "#b32f2f",
    },
  ];
  return (
    <Sider style={siderStyle} width={150}>
      <Row justify="center" align="top" style={{ height: "100%" }}>
        <Col className="layer-2">
          <HeaderComponent />
        </Col>
        <Col
          span={24}
          style={{
            borderTop: "7px solid #698eae",
            paddingTop: 16,
            background: "#80808",
            height: "calc(100% - 90px)",
          }}
        >
          <Row gutter={[0, 16]}>
            {options.map((option, index) => {
              return (
                <Col span={24} key={option.view + index}>
                  <Button
                    className="sider-button"
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: option.color,
                    }}
                    type="ghost"
                    onClick={() => {
                      setView(option.view);
                    }}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      style={{ flexDirection: "column" }}
                    >
                      <Col>{option.icon}</Col>
                      <Col>{option.text}</Col>
                    </Row>
                  </Button>
                  {index !== options.length - 1 && (
                    <Divider
                      style={{
                        margin: "0 auto",
                        width: "80%",
                        minWidth: "80%",
                      }}
                    />
                  )}
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
