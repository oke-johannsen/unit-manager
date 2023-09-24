import React from "react";

const HeaderComponent = () => {
  return (
    <>
      <img
        src="/images/logo.png"
        alt=""
        style={{
          padding: "0.5rem",
          height: 82.5,
          position: "relative",
          zIndex: 2,
        }}
        fetchpriority="high"
      />
    </>
  );
};

export default HeaderComponent;
