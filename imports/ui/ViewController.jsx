import React from "react";
import UserDashboardComponent from "./UserDashboardComponent";
import MembersComponent from "./MemberComponent";

const ViewController = ({ view }) => {
  switch (view) {
    case "dashboard":
      return <UserDashboardComponent />;
    case "members":
      return <MembersComponent />;
    default:
      return <>Error: 404</>;
  }
};

export default ViewController;
