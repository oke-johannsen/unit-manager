import { Col, Modal, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import UserList from "./UserList";

const UserDeleteModal = ({ openUserDeleteModal, setOpenUserDeleteModal }) => {
  const deleteUsers = () => {
    if (openUserDeleteModal?.length) {
      openUserDeleteModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          Meteor.call("users.remove", user._id);
        }
      });
      setOpenUserDeleteModal(false);
    }
  };
  return (
    <Modal
      open={openUserDeleteModal}
      onCancel={() => setOpenUserDeleteModal(false)}
      onOk={deleteUsers}
      cancelText="Abbrechen"
      title="Mitglieder löschen"
      centered
    >
      <Row>
        <Col>
          Bist du sicher, dass du{" "}
          {openUserDeleteModal && openUserDeleteModal.length}{" "}
          {openUserDeleteModal.length === 1 ? "Mitglied" : "Mitglieder"} löschen
          möchtest?
        </Col>
        <UserList dataSource={openUserDeleteModal} />
      </Row>
    </Modal>
  );
};

export default UserDeleteModal;
