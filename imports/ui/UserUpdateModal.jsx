import { Modal } from "antd";
import React from "react";
import UserForm from "./UserForm";

const UserUpdateModal = ({ openUserUpdateModal, setOpenUserUpdateModal }) => {
  return (
    <Modal
      title="Mitglied bearbeiten"
      open={openUserUpdateModal}
      onCancel={() => setOpenUserUpdateModal(false)}
      footer={false}
    >
      <UserForm
        userId={openUserUpdateModal}
        closeModal={() => setOpenUserUpdateModal(false)}
      />
    </Modal>
  );
};

export default UserUpdateModal;
