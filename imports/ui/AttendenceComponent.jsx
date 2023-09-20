import {
  Button,
  Col,
  Dropdown,
  Row,
  Segmented,
  Statistic,
  Table,
  message,
} from "antd";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AttendenceCollection } from "../api/AttendenceApi";
import { ATTENDENCE_TABLE_COLUMNS } from "./ATTENDENCE_TABLE_COLUMNS";
import AttendenceModal from "./AttendenceModal";

const AttendenceComponent = () => {
  const [selected, setSelected] = useState("mission");
  const { attendences } = useTracker(() => {
    const sub = Meteor.subscribe("attendence");
    const userSub = Meteor.subscribe("users");
    const filter =
      selected === "mission" || selected === "training"
        ? { type: selected }
        : {
            $or: [{ type: "mission" }, { type: "training" }],
          };
    return {
      attendences: sub.ready()
        ? AttendenceCollection.find(filter).map((attendence) => {
            return {
              key: attendence._id,
              ...attendence,
            };
          })
        : null,
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
  const options = [
    {
      key: "mission",
      value: "mission",
      label: "Missionen",
    },
    {
      key: "training",
      value: "training",
      label: "Trainings",
    },
    {
      key: "all",
      value: "all",
      label: "Alle",
    },
  ];
  const data = attendences;
  const errorText = "Bitte wähle zuerst ein oder mehr Einsätze aus!";
  const securityClearance = Meteor.user()?.profile?.securityClearance;
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
      if (attendence) {
        attendence.userIds?.forEach((id) => {
          const user = Meteor.users.findOne(id);
          if (user) {
            const newUser = { ...user };
            newUser.profile.points = newUser.profile.points + 5;
            Meteor.call("users.update", newUser);
          }
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
  return (
    <Row>
      <Col span={24}>
        <Row style={{ padding: "0.5rem" }} gutter={16}>
          <Col>
            <Statistic
              title={selected === "mission" ? "Missionen" : "Trainings"}
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
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row gutter={[16, 16]} justify="space-between" align="middle">
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
                      selected={selected}
                      onChange={setSelected}
                    />
                  </Col>
                </Row>
              </Col>
              {rowSelection?.selectedRowKeys?.length > 0 &&
                securityClearance > 3 && (
                  <Col>
                    <Button onClick={handleAddPoints}>Punkte vergeben</Button>
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
            data?.length > 10
              ? {
                  pageSize: 10,
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
                    setRowSelection({ selectedRows, selectedRowKeys });
                  },
                  selectedRowKeys: rowSelection?.selectedRowKeys || [],
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
                }
              },
            };
          }}
        />
      </Col>
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
      />
    </Row>
  );
};

export default AttendenceComponent;
