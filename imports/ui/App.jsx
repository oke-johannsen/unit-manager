import React from "react";
import { Col, ConfigProvider, Row, theme } from "antd";
import LoginComponent from "./LoginComponent";
import HeaderComponent from "./HeaderComponent";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import MainFrameComponent from "./MainFrameComponent";

export const App = () => {
  document.getElementsByTagName("html")[0].setAttribute("lang", "de");
  const { user } = useTracker(() => {
    return {
      user: Meteor.user(),
    };
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#842121",
          colorInfo: "#842121",
          fontSize: 16,
          fontFamily: "'Rajdhani', sans-serif",
          borderRadius: 6,
          wireframe: false,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div id="header-background" />
      <div id="glowing-line" />
      <Row>
        <Col span={24} style={{ height: "100vh" }}>
          {user ? (
            <MainFrameComponent />
          ) : (
            <Row>
              <Col span={24} style={{ height: 90 }}>
                <HeaderComponent />
              </Col>
              <Col
                span={24}
                style={{
                  height: "calc(100vh - 90px)",
                }}
              >
                <LoginComponent />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </ConfigProvider>
  );
};
