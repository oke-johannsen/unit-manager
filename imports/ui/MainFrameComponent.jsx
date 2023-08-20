import React, { useState } from "react";
import { Layout } from "antd";
import ViewController from "./ViewController";
import SidebarComponent from "./SidebarComponent";
const { Header, Content, Footer } = Layout;
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
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#000",
};

const MainFrameComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [view, setView] = useState("dashboard");
  return (
    <Layout style={{ height: "100%" }}>
      <SidebarComponent
        setView={setView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Layout>
        <Header style={headerStyle}></Header>
        <Content style={contentStyle}>
          <ViewController view={view} />
        </Content>
        <Footer style={footerStyle}></Footer>
      </Layout>
    </Layout>
  );
};

export default MainFrameComponent;
