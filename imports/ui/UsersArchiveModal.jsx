import { Col, List, Modal, Row } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";

const UserArchiveModal = ({
  openUserArchiveModal,
  setOpenUserArchiveModal,
}) => {
  const archiveUsers = () => {
    if (openUserArchiveModal?.length) {
      openUserArchiveModal.forEach((userId) => {
        const user = Meteor.users.findOne(userId);
        if (user) {
          console.log(user);
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
        <List
          dataSource={openUserArchiveModal}
          style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
          renderItem={(item) => {
            const user = Meteor.users.findOne(item);
            return (
              <Row style={{ width: "100%" }}>
                {user?.profile?.rank && (
                  <Col span={6}>{user?.profile?.rank}:</Col>
                )}
                <Col flex="auto">{user?.profile?.name}</Col>
              </Row>
            );
          }}
        />
      </Row>
    </Modal>
  );
};

export default UserArchiveModal;
