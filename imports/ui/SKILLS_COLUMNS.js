import { Badge, Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { Meteor } from "meteor/meteor";
import React from "react";

export const SKILLS_COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Ausbilder",
    dataIndex: "trainers",
    key: "trainers",
    render: (trainers) => {
      return (
        <Tooltip
          title={trainers
            ?.map((trainer) => {
              return Meteor.users.findOne(trainer)?.profile?.name || "-";
            })
            .join(", ")}
        >
          <span style={{ display: "block", width: "100%" }}>
            {trainers?.length || 0}
          </span>
        </Tooltip>
      );
    },
    sorter: (a, b) => a.squadMember?.length - b.squadMember?.length,
  },
  {
    title: "Link",
    dataIndex: "link",
    key: "link",
    render: (link) => {
      return link ? (
        <Button type="link" onClick={() => window.open(link, "_blank")}>
          Link
        </Button>
      ) : (
        "-"
      );
    },
  },
  {
    title: "Farbe",
    dataIndex: "color",
    key: "color",
    render: (color) => {
      return <Badge color={color || "#ccc"} />;
    },
  },
];
