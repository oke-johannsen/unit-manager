import { Tooltip } from "antd";
import dayjs from "dayjs";
import React from "react";

export const MEMBER_TABLE_COLUMNS = [
  {
    title: "Dienstgrad",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Zugehörigkeit",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Tier",
    dataIndex: "tier",
    key: "tier",
  },
  {
    title: "Trupp",
    dataIndex: "squad",
    key: "squad",
  },
  {
    title: "Trupp-Position",
    dataIndex: "squadPostion",
    key: "squadPostion",
  },
  {
    title: "Ausbildungen",
    dataIndex: "skills",
    key: "skills",
    render: (skills) => (
      <Tooltip title={skills?.join(", ")}>
        <span style={{ display: "block", width: "100%" }}>
          {skills?.length || 0}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "Betrittsdatum",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => {
      return dayjs(createdAt).format("DD.MM.YYYY");
    },
  },
  {
    title: "Sicherheitsfreigabe",
    dataIndex: "securityClearance",
    key: "securityClearance",
  },
  {
    title: "Belohnungspunkte",
    dataIndex: "points",
    key: "points",
  },
  {
    title: "Inaktivitätspunkte",
    dataIndex: "inactivityPoints",
    key: "inactivityPoints",
  },
];
