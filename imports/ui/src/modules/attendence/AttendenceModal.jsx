import { Col, List, Modal, Row, Tabs, message } from "antd";
import React, { useState } from "react";
import AttendenceForm from "./AttendenceForm";
import dayjs from "dayjs";
import { Meteor } from "meteor/meteor";
import { AttendenceCollection } from "../../../../api/AttendenceApi";
import { useTracker } from "meteor/react-meteor-data";

const AttendenceModal = ({
  openAttendenceCreateModal,
  openAttendenceDeleteModal,
  openAttendenceDisplayModal,
  openAttendenceUpdateModal,
  setOpenAttendenceCreateModal,
  setOpenAttendenceDeleteModal,
  setOpenAttendenceDisplayModal,
  setOpenAttendenceUpdateModal,
  rowSelection,
  date,
  attendenceTypeOptions,
}) => {
  const modalType = () => {
    let type;
    if (openAttendenceCreateModal) {
      type = "insert";
    } else if (openAttendenceDeleteModal) {
      type = "delete";
    } else if (openAttendenceDisplayModal) {
      type = "display";
    } else if (openAttendenceUpdateModal) {
      type = "update";
    } else {
      type = "";
    }
    return type;
  };
  const defaultFormValues = {
    date: date || dayjs(),
    type: "mission",
    userIds: [],
    promotedMembers: [],
  };
  const [form, setForm] = useState();
  const { type, initialFormState } = useTracker(() => {
    const type = modalType();
    const initialFormState =
      type === "insert"
        ? defaultFormValues
        : rowSelection?.selectedRowKeys?.map((id) => {
            const attendence = AttendenceCollection.findOne(id);
            return {
              _id: attendence?._id,
              date: dayjs(attendence?.date),
              type: attendence?.type,
              userIds: attendence?.userIds,
              promotedMembers: attendence?.promotedMembers,
              title: attendence.title,
            };
          });
    setForm(initialFormState);
    return {
      type,
      initialFormState,
    };
  }, [
    openAttendenceCreateModal,
    openAttendenceDeleteModal,
    openAttendenceDisplayModal,
    openAttendenceUpdateModal,
    rowSelection,
  ]);
  const getTitle = () => {
    let title;
    switch (type) {
      case "insert":
        title = "Einsatz anlegen";
        break;
      case "update":
        title = "Einsatz bearbeiten";
        break;
      case "delete":
        title = "Einsatz löschen";
        break;
      case "display":
        title = "Einsatz anzeigen";
        break;
      default:
        title = "";
        break;
    }
    return title;
  };
  const [activeKey, setActiveKey] = useState(
    form && form.length !== undefined && form[0]?._id
  );
  const dataOptions =
    (type === "update" || type === "display") &&
    form &&
    form.length !== undefined &&
    form?.map((item) => {
      const attendence = AttendenceCollection.findOne(item._id);
      const name = attendence.type === "mission" ? "Mission " : "Training ";
      return {
        key: attendence?._id,
        label: name + dayjs(attendence.date).format("DD.MM.YYYY"),
        children: (
          <AttendenceForm
            rowSelection={rowSelection}
            activeKey={attendence?._id}
            type={type}
            setForm={setForm}
            form={form}
            disabled={type === "display"}
            attendenceTypeOptions={attendenceTypeOptions}
          />
        ),
      };
    });
  const buildName = (id) => {
    const user = Meteor.users.findOne(id);
    return user?.profile?.name;
  };
  const getModalBody = () => {
    let body;
    switch (type) {
      case "insert":
        body = (
          <AttendenceForm
            type={type}
            form={form}
            setForm={setForm}
            attendenceTypeOptions={attendenceTypeOptions}
          />
        );
        break;
      case "delete":
        body = (
          <List
            itemLayout="horizontal"
            dataSource={rowSelection?.selectedRowKeys}
            renderItem={(item) => {
              const attendence = AttendenceCollection.findOne(item);
              return (
                <List.Item key={item}>
                  <List.Item.Meta
                    title={`${
                      attendence.type === "mission" ? "Mission" : "Training"
                    }: ${dayjs(attendence.date).format("DD.MM.YYYY")}`}
                    description={
                      <Row>
                        {attendence.userIds.length > 0 && (
                          <Col span={24}>
                            Teilnehmer:{" "}
                            {attendence.userIds
                              .map((item) => {
                                return buildName(item);
                              })
                              .join(", ")}
                          </Col>
                        )}
                        {attendence.promotedMembers.length > 0 && (
                          <Col span={24}>
                            Befördert:{" "}
                            {attendence.promotedMembers
                              .map((item) => {
                                return buildName(item);
                              })
                              .join(", ")}
                          </Col>
                        )}
                      </Row>
                    }
                  />
                </List.Item>
              );
            }}
          />
        );
        break;
      case "update":
      case "display":
        body = (
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={
              dataOptions &&
              dataOptions?.map((option) => {
                return option;
              })
            }
          />
        );
        break;
      default:
        body = <></>;
        break;
    }
    return body;
  };
  const handleOk = () => {
    switch (type) {
      case "insert":
        Meteor.call(
          "attendence.create",
          {
            ...form,
            date: form?.date.toDate(),
          },
          (err, res) => {
            if (!err) {
              message.success("Einsatz erfolgreich angelegt!");
              handleCancel();
            } else {
              message.error("Etwas ist schiefgelaufen!");
              console.error("Error in attendence.create", err, res);
            }
          }
        );
        break;
      case "update":
        if (form && form.length !== undefined) {
          form.forEach((item) => {
            const attendence = AttendenceCollection.findOne(item._id);
            if (attendence) {
              const id = attendence._id;
              Meteor.call(
                "attendence.update",
                id,
                {
                  ...item,
                  date: item?.date.toDate(),
                },
                (err, res) => {
                  if (err) {
                    console.error("Error in attendence.update", err, res);
                  }
                }
              );
            }
          });
          message.success("Die ausgewählten Einsätze wurden aktualisiert!");
          handleCancel();
        }
        break;
      case "delete":
        rowSelection?.selectedRowKeys?.forEach((item) => {
          Meteor.call("attendence.remove", item, (err, res) => {
            if (!err) {
              handleCancel();
            } else {
              console.error("Error in attendence.remove", err, res);
            }
          });
        });
        message.success("Die ausgewählten Einsätze wurden gelöscht!");
        break;
      case "display":
        handleCancel();
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    if (openAttendenceDisplayModal) {
      setOpenAttendenceDisplayModal(false);
    }
    if (openAttendenceCreateModal) {
      setOpenAttendenceCreateModal(false);
    }
    if (openAttendenceUpdateModal) {
      setOpenAttendenceUpdateModal(false);
    }
    if (openAttendenceDeleteModal) {
      setOpenAttendenceDeleteModal(false);
    }
    setForm(defaultFormValues);
  };

  const getOkText = () => {
    let okText;
    switch (type) {
      case "insert":
        okText = "Speichern";
        break;
      case "update":
        okText = "Speichern";
        break;
      case "display":
        okText = "Schließen";
        break;
      case "delete":
        okText = "Löschen";
        break;
      default:
        okText = "OK";
        break;
    }
    return okText;
  };

  return (
    <Modal
      open={
        openAttendenceCreateModal ||
        openAttendenceDeleteModal ||
        openAttendenceDisplayModal ||
        openAttendenceUpdateModal
      }
      onCancel={handleCancel}
      title={getTitle()}
      onOk={handleOk}
      okText={getOkText()}
      cancelText="Abbrechen"
      centered
      destroyOnClose
    >
      {getModalBody()}
    </Modal>
  );
};

export default AttendenceModal;
