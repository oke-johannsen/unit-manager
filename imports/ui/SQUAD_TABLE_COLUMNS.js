import { Tooltip } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";

export const SQUAD_TABLE_COLUMNS = [
  {
    title: "Truppname",
    dataIndex: "squadName",
    key: "squadName",
  },
  {
    title: "Zugehörigkeit",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Truppführung",
    dataIndex: "squadLead",
    key: "squadLead",
    render: (squadLead) => {
      return Meteor.users.findOne(squadLead)?.profile?.name || "-";
    },
  },
  {
    title: "Truppmitglieder",
    dataIndex: "squadMember",
    key: "squadMember",
    render: (squadMember) => (
      <Tooltip
        title={squadMember
          ?.map((member) => {
            return Meteor.users.findOne(member)?.profile?.name || "-";
          })
          .join(", ")}
      >
        <span style={{ display: "block", width: "100%" }}>
          {squadMember?.length || 0}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "Spezialisierung",
    dataIndex: "speciality",
    key: "speciality",
  },
];
