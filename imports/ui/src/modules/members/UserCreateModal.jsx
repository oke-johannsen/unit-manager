import { Modal, message } from "antd";
import React, { useState } from "react";
import UserForm from "./UserForm";
import { Meteor } from "meteor/meteor";
import dayjs from "dayjs";

const UserCreateModal = ({ openUserCreateModal, setOpenUserCreateModal }) => {
  const [forms, setForms] = useState({});
  const submitForms = (forms) => {
    if (Object.values(forms)?.length) {
      Object.values(forms).forEach((values) => {
        const profileData = {
          name: values.name,
          tier: values.tier,
          designation: values.designation,
          rank: values.rank,
          squad: values.squad,
          squadPosition: values.squadPosition,
          securityClearance: values.securityClearance,
          points: values.points,
          inactivityPoints: values.inactivityPoints,
          skills: values.skills,
        };
        const payload = {
          username: values.username,
          password: values.password,
          createdAt: dayjs(values.createdAt).toDate(),
          profile: profileData,
        };
        Meteor.call("users.create", payload, (err, res) => {
          if (!err) {
            message.success("Mitglied erfolgreich angelegt!");
            setOpenUserCreateModal(false);
          } else {
            console.error("Error in users.update", err, res);
            message.error("Anlegen von Mitglied fehlgeschlagen!");
          }
        });
      });
    }
  };
  return (
    <Modal
      title="Mitglied anlegen"
      open={openUserCreateModal}
      onCancel={() => setOpenUserCreateModal(false)}
      footer={false}
      centered
      destroyOnClose
    >
      <UserForm
        closeModal={() => setOpenUserCreateModal(false)}
        forms={forms}
        setForms={setForms}
        submitForms={submitForms}
      />
    </Modal>
  );
};

export default UserCreateModal;
