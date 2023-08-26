import React from "react";
import UserDashboardComponent from "./UserDashboardComponent";
import MembersComponent from "./MemberComponent";
import AttendenceComponent from "./AttendenceComponent";

const ViewController = ({ view }) => {
  switch (view) {
    case "dashboard":
      return <UserDashboardComponent userProp={Meteor.user()} />;
    case "members":
      return <MembersComponent />;
    case "attendence":
      return <AttendenceComponent />;
    default:
      return <>Error: 404</>;
  }
};

export default ViewController;
