import dayjs from "dayjs";

export const MEMBER_TABLE_COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Dienstgrad",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Zugehörigkeit",
    dataIndex: "designation",
    key: "designation",
  },
  {
    title: "Trupp",
    dataIndex: "squad",
    key: "squad",
  },
  {
    title: "Behlohnungspunkte",
    dataIndex: "points",
    key: "points",
  },
  {
    title: "Letzte Beförderung",
    dataIndex: "promotionHistory",
    key: "promotionHistory",
    render: (promotionHistory) => {
      return promotionHistory && promotionHistory?.length
        ? dayjs(promotionHistory[promotionHistory?.length - 1]).format(
            "DD.MM.YYYY"
          )
        : undefined;
    },
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
    title: "Inaktivitätspunkte",
    dataIndex: "inactivityPoints",
    key: "inactivityPoints",
  },
  {
    title: "Tier",
    dataIndex: "tier",
    key: "tier",
  },
  {
    title: "Trupp-Position",
    dataIndex: "squadPosition",
    key: "squadPosition",
  },
  {
    title: "Sicherheitsfreigabe",
    dataIndex: "securityClearance",
    key: "securityClearance",
  },
];