import { Col, List, Modal, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import UserList from "./UserList";

const UserReactivateModal = ({
  openUserReactivateModal,
  setOpenUserReactivateModal,
}) => {
  const reactivateUsers = () => {
    if (openUserReactivateModal?.length) {
      openUserReactivateModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          const data = {
            ...user,
            profile: {
              ...(user.profile || {}),
              status: "active",
            },
          };
          Meteor.call("users.update", data);
        }
      });
      setOpenUserReactivateModal(false);
    }
  };
  return (
    <Modal
      open={openUserReactivateModal}
      onCancel={() => setOpenUserReactivateModal(false)}
      onOk={reactivateUsers}
      cancelText="Abbrechen"
      title="Mitglieder auf aktiv setzen"
    >
      <Row>
        <Col>
          Bist du sicher, dass du{" "}
          {openUserReactivateModal && openUserReactivateModal.length}{" "}
          {openUserReactivateModal.length === 1 ? "Mitglied" : "Mitglieder"} auf
          inaktiv setzen möchtest?
        </Col>
        <UserList dataSource={openUserReactivateModal} />
      </Row>
    </Modal>
  );
};

export default UserReactivateModal;
