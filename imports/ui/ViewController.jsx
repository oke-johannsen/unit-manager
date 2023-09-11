import React from "react";
import UserDashboardComponent from "./UserDashboardComponent";
import MembersComponent from "./MemberComponent";
import AttendenceComponent from "./AttendenceComponent";
import SquadsComponent from "./SquadsComponent";
import RecruitmentComponent from "./RecruitmentComponent";

const ViewController = ({ view }) => {
  switch (view) {
    case "dashboard":
      return <UserDashboardComponent userProp={Meteor.user()} />;
    case "members":
      return <MembersComponent />;
    case "attendence":
      return <AttendenceComponent />;
    case "squads":
      return <SquadsComponent />;
    case "recruitment":
      return <RecruitmentComponent />;
    default:
      return <>Error: 404</>;
  }
};

export default ViewController;
