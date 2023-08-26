import { Col, Dropdown, Row, Segmented, Table, message } from "antd";
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
    const status = selected === "training" ? { $ne: "mission" } : "mission";
    return {
      attendences: sub.ready()
        ? AttendenceCollection.find({ type: status }).map((attendence) => {
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
  ];
  const data = attendences;
  const errorText = "Bitte wähle zuerst ein oder mehr Einsätze aus!";

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
    {
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
  return (
    <Row>
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row justify="space-between" align="middle">
              <Col flex="auto">
                <span
                  style={{
                    margin: "0 1.5rem 0 0",
                    padding: 0,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  Einstatzliste
                </span>
                <Segmented
                  options={options}
                  selected={selected}
                  onChange={setSelected}
                />
              </Col>
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
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              setRowSelection({ selectedRows, selectedRowKeys });
            },
            selectedRowKeys: rowSelection?.selectedRowKeys || [],
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
      />
    </Row>
  );
};

export default AttendenceComponent;