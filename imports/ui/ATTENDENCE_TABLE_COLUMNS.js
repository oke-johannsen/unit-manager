import dayjs from "dayjs";
import { Meteor } from "meteor/meteor";

export const ATTENDENCE_TABLE_COLUMNS = [
  {
    title: "Datum",
    dataIndex: "date",
    key: "date",
    render: (date) => dayjs(date).format("DD.MM.YYYY"),
  },
  {
    title: "Art",
    dataIndex: "type",
    key: "type",
    render: (type) => (type === "mission" ? "Mission" : "Training"),
  },
  {
    title: "Teilnehmer",
    dataIndex: "userIds",
    key: "userIds",
    render: (userIds) => {
      return userIds
        ?.map((userId) => Meteor.users.findOne(userId)?.profile?.name)
        .join(", ");
    },
  },
  {
    title: "Beförderte Mitglieder",
    dataIndex: "promotedMembers",
    key: "promotedMembers",
    render: (promotedMembers) => {
      return promotedMembers
        ?.map((userId) => Meteor.users.findOne(userId)?.profile?.name)
        .join(", ");
    },
  },
];
