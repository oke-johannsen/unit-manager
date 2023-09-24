import React from "react";
import MembersComponent from "../../modules/members/MemberComponent";
import AttendenceComponent from "../../modules/attendence/AttendenceComponent";
import SquadsComponent from "../../modules/squads/SquadsComponent";
import LogComponent from "../../modules/logs/LogComponent";
import { Button, Result } from "antd";
import SkillsComponent from "../../modules/skills/SkillsComponent";
import UserDashboardComponent from "../../modules/members/UserDashboardComponent";
import RecruitmentComponent from "../../modules/recruitment/RecruitmentComponent";

const ViewController = ({ view, setView }) => {
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
    case "logging":
      return <LogComponent />;
    case "skills":
      return <SkillsComponent />;
    default:
      return (
        <Result
          icon={<img style={{ height: "20vh" }} src="/images/logo.png" />}
          title="ERROR - 404"
          subTitle="Sorry, die aufgerufene Seite existiert nicht."
          extra={
            <Button type="primary" onClick={() => setView("dashboard")}>
              Zurück zum Dashboard
            </Button>
          }
        />
      );
  }
};

export default ViewController;
