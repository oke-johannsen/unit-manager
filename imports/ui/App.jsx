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

  const backgroundSettings = !user
    ? {
        backgroundImage:
          "url('https://static.wixstatic.com/media/44674e_0585866da94e414aa9e5e04462d94ef3~mv2.png/v1/fill/w_1166,h_608,fp_0.50_0.50,q_90,usm_0.66_1.00_0.01,enc_auto/footer.png')",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "bottom",
        backgroundSize: "cover",
      }
    : {};

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#5f1d1d",
          colorInfo: "#5f1d1d",
          fontSize: 16,
          fontFamily: "'Rajdhani', sans-serif",
          borderRadius: 6,
          wireframe: true,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Row>
        <Col span={24} style={{ height: "100vh" }}>
          {user ? (
            <MainFrameComponent />
          ) : (
            <Row>
              <Col span={24} style={{ height: "5vh" }}>
                <HeaderComponent />
              </Col>
              <Col
                span={24}
                style={{
                  height: "95vh",
                  ...backgroundSettings,
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
