import {
  Button,
  Calendar,
  Card,
  Col,
  Dropdown,
  Modal,
  Radio,
  Row,
  Segmented,
  Select,
  Statistic,
  Table,
  Tabs,
  message,
} from "antd";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AttendenceCollection } from "../../../../api/AttendenceApi";
import { ATTENDENCE_TABLE_COLUMNS } from "./ATTENDENCE_TABLE_COLUMNS";
import AttendenceModal from "./AttendenceModal";
import dayjs from "dayjs";
import { AttendenceTypeCollection } from "../../../../api/AttendenceTypesApi";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AttendenceTypeModal from "./AttendenceTypeModal";
import locale from "antd/es/calendar/locale/de_DE";

const AttendenceComponent = () => {
  const [selected, setSelected] = useState("all");
  const { attendences, attendenceTypeOptions, attendenceTypes } =
    useTracker(() => {
      const subs = [
        Meteor.subscribe("attendence"),
        Meteor.subscribe("users"),
        Meteor.subscribe("attendenceTypes"),
      ];
      const filter = selected !== "all" ? { type: selected } : {};
      const attendenceTypes = AttendenceTypeCollection.find({}).map((item) => ({
        key: item._id,
        value: item.value,
        label: item.label,
      }));
      return {
        attendences: subs.every((sub) => sub.ready())
          ? AttendenceCollection.find(filter, { sort: { date: -1 } }).map(
              (attendence) => {
                return {
                  key: attendence._id,
                  ...attendence,
                };
              }
            )
          : null,
        attendenceTypeOptions: [
          { key: "all", label: "Alle", value: "all" },
          { key: "mission", label: "Mission", value: "mission" },
          { key: "training", label: "Training", value: "training" },
          ...(subs.every((sub) => sub.ready()) ? attendenceTypes : []),
        ],
        attendenceTypes: attendenceTypes,
      };
    }, [selected]);
  const [openAttendenceCreateModal, setOpenAttendenceCreateModal] =
    useState(false);
  const [openAttendenceDisplayModal, setOpenAttendenceDisplayModal] =
    useState(false);
  const [openAttendenceUpdateModal, setOpenAttendenceUpdateModal] =
    useState(false);
  const [openAttendenceDeleteModal, setOpenAttendenceDeleteModal] =
    useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const [date, setDate] = useState(null);
  const options = [
    {
      key: "mission",
      value: "mission",
      label: "Missionen",
    },
    ...(window.innerWidth > 700
      ? [
          {
            key: "training",
            value: "training",
            label: "Trainings",
          },
        ]
      : []),
    {
      key: "all",
      value: "all",
      label: "Alle",
    },
  ];
  const data = attendences;
  const errorText = "Bitte wähle zuerst ein oder mehr Einsätze aus!";
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance);
  const items = [
    {
      key: "read",
      label: "Anzeigen",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenAttendenceDisplayModal(rowSelection.selectedRowKeys);
        } else {
          message.warning(errorText);
        }
      },
    },
    {
      key: "edit",
      label: "Bearbeiten",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenAttendenceUpdateModal(rowSelection.selectedRowKeys);
        } else {
          message.warning(errorText);
        }
      },
    },
    securityClearance > 3 && {
      key: "delete",
      label: "Löschen",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenAttendenceDeleteModal(rowSelection.selectedRowKeys);
        } else {
          message.warning(errorText);
        }
      },
    },
  ];
  const handleAddPoints = () => {
    rowSelection?.selectedRowKeys?.forEach((item) => {
      const attendence = AttendenceCollection.findOne(item);
      if (attendence.spentPoints !== true) {
        attendence.userIds?.forEach((id) => {
          const user = Meteor.users.findOne(id);
          if (user) {
            const newUser = { ...user };
            newUser.profile.points =
              newUser?.profile?.points +
              (attendence.type === "mission" ? 5 : 10);
            Meteor.call("users.update", newUser);
          }
        });
        const { userIds, type, date, promotedMembers } = attendence;
        Meteor.call("attendence.update", attendence._id, {
          userIds,
          type,
          date,
          promotedMembers,
          spentPoints: true,
        });
      }
    });
  };
  const getAverageParticipants = () => {
    if (attendences?.length) {
      const { totalParticipants, totalEntries } = attendences.reduce(
        (accumulator, entry) => {
          accumulator.totalParticipants += entry.userIds.length;
          accumulator.totalEntries += 1;
          return accumulator;
        },
        { totalParticipants: 0, totalEntries: 0 }
      );
      const averageParticipants = totalParticipants / totalEntries;
      return Math.floor(averageParticipants);
    } else {
      return 0;
    }
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      <Tabs
        items={[
          {
            key: "1",
            label: "Kalender",
            children: (
              <Calendar
                locale={locale}
                onSelect={(date, selectInfo) => {
                  if (selectInfo.source === "date" && securityClearance > 1) {
                    setDate(date);
                    setOpenAttendenceCreateModal(true);
                  }
                }}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const monthOptions = [
                    { key: "month-0", value: 0, label: "Januar" },
                    { key: "month-1", value: 1, label: "Februar" },
                    { key: "month-2", value: 2, label: "März" },
                    { key: "month-3", value: 3, label: "April" },
                    { key: "month-4", value: 4, label: "Mai" },
                    { key: "month-5", value: 5, label: "Juni" },
                    { key: "month-6", value: 6, label: "Juli" },
                    { key: "month-7", value: 7, label: "August" },
                    { key: "month-8", value: 8, label: "September" },
                    { key: "month-9", value: 9, label: "Oktober" },
                    { key: "month-10", value: 10, label: "November" },
                    { key: "month-11", value: 11, label: "Dezember" },
                  ];
                  const year = value.year();
                  const month = value.month();
                  const yearOptions = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    yearOptions.push({ key: i, value: i, label: i });
                  }
                  return (
                    <div
                      style={{
                        padding: 8,
                      }}
                    >
                      <Row gutter={8} justify="end">
                        <Col>
                          <Segmented
                            options={options}
                            value={selected}
                            onChange={setSelected}
                          />
                        </Col>
                        <Col>
                          <Select
                            value={year}
                            options={yearOptions}
                            onChange={(newYear) => {
                              const now = value.clone().year(newYear);
                              onChange(now);
                            }}
                          ></Select>
                        </Col>
                        <Col>
                          <Select
                            value={month}
                            options={monthOptions}
                            popupMatchSelectWidth={false}
                            onChange={(newMonth) => {
                              const now = value.clone().month(newMonth);
                              onChange(now);
                            }}
                          />
                        </Col>
                        <Col>
                          <Radio.Group
                            onChange={(e) => onTypeChange(e.target.value)}
                            value={type}
                          >
                            <Radio.Button value="month">Monat</Radio.Button>
                            <Radio.Button value="year">Jahr</Radio.Button>
                          </Radio.Group>
                        </Col>
                      </Row>
                    </div>
                  );
                }}
                cellRender={(date, info) => {
                  switch (info?.type) {
                    case "date": {
                      const attendences = AttendenceCollection.find({
                        ...(selected !== "all" ? { type: selected } : {}),
                        $and: [
                          { date: { $gte: date.startOf("day").toDate() } },
                          { date: { $lte: date.endOf("day").toDate() } },
                        ],
                      }).map((attendence) => {
                        return (
                          <Col
                            span={24}
                            key={attendence._id}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setOpenAttendenceUpdateModal(true);
                              setRowSelection({
                                selectedRowKeys: [attendence._id],
                                selectedRows: [attendence],
                              });
                            }}
                          >
                            {attendence.title ||
                              (attendence.type === "mission"
                                ? "Mission"
                                : attendence.type === "training"
                                ? "Training"
                                : attendence.type)}
                            : {dayjs(attendence.date).format("HH:mm")}
                          </Col>
                        );
                      });
                      return (
                        <Row gutter={[4, 4]} style={{ width: "100%" }}>
                          {attendences}
                        </Row>
                      );
                    }
                    case "month": {
                      const attendences = AttendenceCollection.find({
                        ...(selected !== "all" ? { type: selected } : {}),
                        $and: [
                          { date: { $gte: date.startOf("week").toDate() } },
                          { date: { $lte: date.endOf("week").toDate() } },
                        ],
                      }).map((attendence) => {
                        return (
                          <Col
                            span={24}
                            key={attendence._id}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setOpenAttendenceUpdateModal(true);
                              setRowSelection({
                                selectedRowKeys: [attendence._id],
                                selectedRows: [attendence],
                              });
                            }}
                          >
                            {attendence.title ||
                              (attendence.type === "mission"
                                ? "Mission"
                                : attendence.type === "training"
                                ? "Training"
                                : attendence.type)}
                            :{" "}
                            {dayjs(attendence.date).format("DD.MM.YYYY HH:mm")}
                          </Col>
                        );
                      });
                      return (
                        <Row gutter={[4, 4]} style={{ width: "100%" }}>
                          {attendences}
                        </Row>
                      );
                    }
                    default:
                      break;
                  }
                }}
              />
            ),
          },
          {
            key: "2",
            label: "Tabelle",
            children: (
              <Row>
                {window.innerWidth > 700 && (
                  <Col span={24}>
                    <Row style={{ padding: "0.5rem" }} gutter={16}>
                      <Col>
                        <Statistic
                          title={
                            selected === "mission"
                              ? "Missionen"
                              : selected === "trainings"
                              ? "Trainings"
                              : "Einsätze"
                          }
                          value={attendences?.length || 0}
                        />
                      </Col>
                      <Col>
                        <Statistic
                          title="Durchschnittliche Teilnehmerzahl"
                          value={getAverageParticipants()}
                        />
                      </Col>
                    </Row>
                  </Col>
                )}
                <Col span={24}>
                  <Table
                    scroll={{ x: 150 }}
                    title={() => (
                      <Row
                        gutter={[16, 16]}
                        justify="space-between"
                        align="middle"
                      >
                        <Col flex="auto">
                          <Row gutter={[16, 16]} align="middle">
                            <Col>
                              <span
                                style={{
                                  margin: "0 1.5rem 0 0",
                                  padding: 0,
                                  fontSize: 24,
                                  fontFamily: "'Bebas Neue', sans-serif",
                                }}
                              >
                                Einstatzliste
                              </span>
                            </Col>
                            <Col>
                              <Segmented
                                options={options}
                                value={selected}
                                onChange={setSelected}
                              />
                            </Col>
                          </Row>
                        </Col>
                        {rowSelection?.selectedRowKeys?.length > 0 &&
                          securityClearance > 3 && (
                            <Col>
                              <Button onClick={handleAddPoints}>
                                Punkte vergeben
                              </Button>
                            </Col>
                          )}
                        {securityClearance > 2 && (
                          <Col>
                            <Dropdown.Button
                              type="primary"
                              onClick={() => setOpenAttendenceCreateModal(true)}
                              menu={{
                                items,
                              }}
                            >
                              Erstellen
                            </Dropdown.Button>
                          </Col>
                        )}
                      </Row>
                    )}
                    columns={ATTENDENCE_TABLE_COLUMNS}
                    dataSource={data}
                    pagination={
                      data?.length > 7
                        ? {
                            pageSize: 7,
                            responsive: true,
                            showTotal: () => (
                              <span>{`Insgegsamt: ${data.length} Einsätze`}</span>
                            ),
                            showSizeChanger: false,
                          }
                        : false
                    }
                    loading={!data?.length == null}
                    style={{
                      padding: "0.5rem",
                    }}
                    rowSelection={
                      securityClearance > 2
                        ? {
                            type: "checkbox",
                            onChange: (selectedRowKeys, selectedRows) => {
                              setRowSelection({
                                selectedRows,
                                selectedRowKeys,
                              });
                            },
                            selectedRowKeys:
                              rowSelection?.selectedRowKeys || [],
                          }
                        : false
                    }
                    onRow={(record, index) => {
                      return {
                        onClick: () => {
                          if (securityClearance < 3) {
                            setRowSelection({
                              selectedRows: [record],
                              selectedRowKeys: [record.key],
                            });
                            setOpenAttendenceDisplayModal([record._id]);
                          } else {
                            setRowSelection({
                              selectedRows: [record],
                              selectedRowKeys: [record.key],
                            });
                            setOpenAttendenceUpdateModal([record._id]);
                          }
                        },
                      };
                    }}
                  />
                </Col>
              </Row>
            ),
          },
          {
            key: "3",
            label: "Einsatzarten",
            children: (
              <Row gutter={[16, 16]}>
                {securityClearance > 1 && (
                  <Col span={24}>
                    <Row justify="end">
                      <Col>
                        <Button type="primary" onClick={() => setOpen(true)}>
                          <PlusOutlined /> Erstellen
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                )}
                {(attendenceTypes || []).map((item) => {
                  return (
                    <Col
                      key={item.key}
                      xs={24}
                      sm={24}
                      md={12}
                      lg={8}
                      xl={6}
                      xxl={4}
                    >
                      <Card
                        bordered={false}
                        actions={
                          securityClearance > 1
                            ? [
                                <EditOutlined
                                  key={item.key + "-edit"}
                                  onClick={() => {
                                    setTitle("Einsatzart bearbeiten");
                                    setOpen(true);
                                    setValue(
                                      AttendenceTypeCollection.findOne(item.key)
                                    );
                                  }}
                                />,
                                <DeleteOutlined
                                  key={item.key + "-delete"}
                                  onClick={() => setDeleteModal(item)}
                                />,
                              ]
                            : undefined
                        }
                      >
                        <Row>
                          <Col>{item.label}</Col>
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ),
          },
        ]}
      />
      {deleteModal && (
        <Modal
          title="Bist du dir sicher?"
          okText="Löschen"
          open={deleteModal}
          okButtonProps={{ danger: true }}
          onOk={() =>
            Meteor.call(
              "attendenceTypes.remove",
              deleteModal.key,
              (err, res) => {
                if (!err) {
                  setDeleteModal(false);
                } else {
                  console.error(err, res);
                  message.error(
                    "Etwas ist schief gelaufen, bitte versuche es erneut!"
                  );
                }
              }
            )
          }
          onCancel={() => setDeleteModal(false)}
          closable
          centered
        >
          Wenn du auf "Löschen" klickst, wird diese Einsatzart gelöscht.
        </Modal>
      )}
      {open && (
        <AttendenceTypeModal
          open={open}
          setOpen={setOpen}
          value={value}
          title={title}
        />
      )}
      {(openAttendenceCreateModal ||
        openAttendenceDeleteModal ||
        openAttendenceDisplayModal ||
        openAttendenceUpdateModal) && (
        <AttendenceModal
          openAttendenceCreateModal={openAttendenceCreateModal}
          openAttendenceDeleteModal={openAttendenceDeleteModal}
          openAttendenceDisplayModal={openAttendenceDisplayModal}
          openAttendenceUpdateModal={openAttendenceUpdateModal}
          setOpenAttendenceCreateModal={setOpenAttendenceCreateModal}
          setOpenAttendenceDeleteModal={setOpenAttendenceDeleteModal}
          setOpenAttendenceDisplayModal={setOpenAttendenceDisplayModal}
          setOpenAttendenceUpdateModal={setOpenAttendenceUpdateModal}
          rowSelection={rowSelection}
          date={date}
          attendenceTypeOptions={attendenceTypeOptions}
        />
      )}
    </>
  );
};

export default AttendenceComponent;
