import { Col, Modal, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import UserList from "./UserList";

const UserDeleteModal = ({ openUserDeleteModal, setOpenUserDeleteModal }) => {
  const deleteUsers = () => {
    if (openUserDeleteModal?.length) {
      let error = false;
      openUserDeleteModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          Meteor.call("users.remove", user._id, (err, _res) => {
            if (err) {
              error = true;
            }
          });
        }
      });
      setOpenUserDeleteModal(false);
      if (!error) {
        message.success(`Mitglieder erfolgreich gelöscht!`);
      } else {
        message.error(`Löschen von Mitgliedern fehlgeschlagen!`);
      }
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
