import { Col, List, Modal, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import UserList from "./UserList";

const UserArchiveModal = ({
  openUserArchiveModal,
  setOpenUserArchiveModal,
}) => {
  const archiveUsers = () => {
    if (openUserArchiveModal?.length) {
      openUserArchiveModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          const data = {
            ...user,
            profile: {
              ...(user.profile || {}),
              status: "inactive",
            },
          };
          Meteor.call("users.update", data);
        }
      });
      setOpenUserArchiveModal(false);
    }
  };
  return (
    <Modal
      open={openUserArchiveModal}
      onCancel={() => setOpenUserArchiveModal(false)}
      onOk={archiveUsers}
      cancelText="Abbrechen"
      title="Mitglieder auf inaktiv setzen"
    >
      <Row>
        <Col>
          Bist du sicher, dass du{" "}
          {openUserArchiveModal && openUserArchiveModal.length}{" "}
          {openUserArchiveModal.length === 1 ? "Mitglied" : "Mitglieder"} auf
          inaktiv setzen möchtest?
        </Col>
        <UserList dataSource={openUserArchiveModal} />
      </Row>
    </Modal>
  );
};

export default UserArchiveModal;
