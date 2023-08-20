import { Modal } from "antd";
import React from "react";
import UserForm from "./UserForm";

const UserCreateModal = ({ openUserCreateModal, setOpenUserCreateModal }) => {
  return (
    <Modal
      title="Mitglied anlegen"
      open={openUserCreateModal}
      onCancel={() => setOpenUserCreateModal(false)}
      footer={false}
    >
      <UserForm closeModal={() => setOpenUserCreateModal(false)} />
    </Modal>
  );
};

export default UserCreateModal;
