import { Modal, Tabs } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import UserDashboardComponent from "./UserDashboardComponent";

const UserDisplayModal = ({
  openUserDisplayModal,
  setOpenUserDisplayModal,
}) => {
  return (
    <Modal
      open={openUserDisplayModal}
      onCancel={() => setOpenUserDisplayModal(false)}
      width={"85vw"}
      footer={false}
      title="Mitglieder anzeigen"
    >
      <Tabs
        items={
          openUserDisplayModal &&
          openUserDisplayModal.map((userId) => {
            const user = Meteor.users.findOne(userId);
            return {
              key: userId,
              label: user?.profile?.name,
              children: <UserDashboardComponent userProp={user} />,
            };
          })
        }
      />
    </Modal>
  );
};

export default UserDisplayModal;
