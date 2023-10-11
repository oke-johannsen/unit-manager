import React from "react";
import { App, Col, ConfigProvider, Row, theme } from "antd";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import LoginComponent from "./layout/login/LoginComponent";
import MainFrameComponent from "./layout/common/MainFrameComponent";
import HeaderComponent from "./layout/common/HeaderComponent";
import dayjs from "dayjs";
import deDe from "antd/locale/de_DE";
import "dayjs/locale/de";
dayjs.locale("de");

export const BaseComponent = () => {
  document.getElementsByTagName("html")[0].setAttribute("lang", "de");
  const { user } = useTracker(() => {
    return {
      user: Meteor.user(),
    };
  });

  return (
    <ConfigProvider
      locale={deDe}
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
      <App>
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
      </App>
    </ConfigProvider>
  );
};
