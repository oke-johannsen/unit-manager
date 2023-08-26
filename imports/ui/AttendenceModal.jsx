import { Modal } from "antd";
import React, { useState } from "react";
import AttendenceForm from "./AttendenceForm";
import dayjs from "dayjs";
import { Meteor } from "meteor/meteor";

const AttendenceModal = ({
  openAttendenceCreateModal,
  openAttendenceDeleteModal,
  openAttendenceDisplayModal,
  openAttendenceUpdateModal,
  setOpenAttendenceCreateModal,
  setOpenAttendenceDeleteModal,
  setOpenAttendenceDisplayModal,
  setOpenAttendenceUpdateModal,
}) => {
  const defaultFormValues = {
    date: dayjs(),
    type: "mission",
    userIds: [],
    promotedMembers: [],
  };
  const [form, setForm] = useState(defaultFormValues);
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
  const getTitle = () => {
    let title;
    const type = modalType();
    switch (type) {
      case "insert":
        title = "Einsatz anlegen";
        break;
      case "update":
        title = "Einsatz anlegen";
        break;
      case "delete":
        title = "Einsatz anlegen";
        break;
      case "display":
        title = "Einsatz anlegen";
        break;
      default:
        title = "";
        break;
    }
    return title;
  };
  const getModalBody = () => {
    let body;
    const type = modalType();
    switch (type) {
      case "insert":
      case "update":
      case "delete":
      case "display":
        body = <AttendenceForm type={type} form={form} setForm={setForm} />;
        break;
      default:
        body = <></>;
        break;
    }
    return body;
  };
  const handleOk = () => {
    const type = modalType();
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
              handleCancel();
            } else {
              console.error("Error in attendence.create", err, res);
            }
          }
        );
        break;
      case "update":
      case "delete":
      case "display":
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setOpenAttendenceCreateModal(false);
    setOpenAttendenceDeleteModal(false);
    setOpenAttendenceDisplayModal(false);
    setOpenAttendenceUpdateModal(false);
    setForm(defaultFormValues);
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
      destroyOnClose
    >
      {getModalBody()}
    </Modal>
  );
};

export default AttendenceModal;
