import {
  Button,
  Col,
  Dropdown,
  Row,
  Segmented,
  Statistic,
  Table,
  message,
} from "antd";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { MEMBER_TABLE_COLUMNS } from "./MEMBER_TABLE_COLUMNS";
import UserCreateModal from "./UserCreateModal";
import UserUpdateModal from "./UserUpdateModal";
import UserDisplayModal from "./UserDisplayModal";
import UserArchiveModal from "./UsersArchiveModal";
import UserReactivateModal from "./UserReactiveModal";
import UserDeleteModal from "./UserDeleteModal";
import PasswordResetModal from "./PasswordResetModal";

const MembersComponent = () => {
  const [selected, setSelected] = useState("active");
  const { users } = useTracker(() => {
    const sub = Meteor.subscribe("users", {});
    const squadSub = Meteor.subscribe("squads");
    const skillsSub = Meteor.subscribe("skills");
    const status = selected === "active" ? { $ne: "inactive" } : "inactive";
    return {
      users: sub.ready()
        ? Meteor.users.find({ "profile.status": status }).map((user) => {
            return {
              key: user._id,
              ...user,
              ...user.profile,
            };
          })
        : null,
      squadsReady: squadSub.ready(),
      skillsSub: skillsSub.ready(),
    };
  });
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);
  const [openUserUpdateModal, setOpenUserUpdateModal] = useState(false);
  const [openUserDisplayModal, setOpenUserDisplayModal] = useState(false);
  const [openUserArchiveModal, setOpenUserArchiveModal] = useState(false);
  const [openUserReactivateModal, setOpenUserReactivateModal] = useState(false);
  const [openUserDeleteModal, setOpenUserDeleteModal] = useState(false);
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const options = [
    {
      key: "active",
      value: "active",
      label: "Aktiv",
    },
    {
      key: "inactive",
      value: "inactive",
      label: "Inaktiv",
    },
  ];
  const data = users;
  const securityClearance = Meteor.user()?.profile?.securityClearance;
  const items = [
    {
      key: "read",
      label: "Anzeigen",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenUserDisplayModal(rowSelection.selectedRowKeys);
        } else {
          message.warning("Bitte wähle zuerst ein oder mehr Mitglieder aus!");
        }
      },
    },
    selected === "active" && {
      key: "edit",
      label: "Bearbeiten",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpenUserUpdateModal(rowSelection.selectedRowKeys);
        } else {
          message.warning("Bitte wähle zuerst ein oder mehr Mitglieder aus!");
        }
      },
    },
    selected === "active" &&
      securityClearance > 3 && {
        key: "archive",
        label: "Archivieren",
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserArchiveModal(rowSelection.selectedRowKeys);
          } else {
            message.warning("Bitte wähle zuerst ein oder mehr Mitglieder aus!");
          }
        },
      },
    selected === "inactive" &&
      securityClearance > 3 && {
        key: "reactivate",
        label: "Reaktivieren",
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserReactivateModal(rowSelection.selectedRowKeys);
          } else {
            message.warning("Bitte wähle zuerst ein oder mehr Mitglieder aus!");
          }
        },
      },
    selected === "inactive" &&
      securityClearance > 3 && {
        key: "delete",
        label: "Löschen",
        onClick: () => {
          if (rowSelection && rowSelection?.selectedRowKeys?.length) {
            setOpenUserDeleteModal(rowSelection.selectedRowKeys);
          } else {
            message.warning("Bitte wähle zuerst ein oder mehr Mitglieder aus!");
          }
        },
      },
    securityClearance > 3 && {
      key: "resetPassword",
      label: "Passwort ändern",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          if (rowSelection?.selectedRowKeys?.length > 1) {
            message.warning("Bitte wähle nur ein Mitglied aus!");
          } else {
            setOpenPasswordResetModal(rowSelection.selectedRowKeys);
          }
        } else {
          message.warning("Bitte wähle zuerst ein Mitglied aus!");
        }
      },
    },
  ];
  return (
    <Row>
      {selected === "active" && (
        <Col span={24}>
          <Row style={{ padding: "0.5rem" }} gutter={16}>
            <Col>
              <Statistic title="Mitgliederanzahl" value={users?.length || 0} />
            </Col>
            <Col>
              <Statistic
                title="Tier-3 Operator"
                value={
                  users?.filter((user) => user?.profile?.tier === 3)?.length
                }
              />
            </Col>
          </Row>
        </Col>
      )}
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row gutter={[16, 16]} justify="space-between" align="middle">
              <Col flex="auto">
                <Row gutter={[16, 16]} align="middle">
                  <Col>
                    <span
                      style={{
                        margin: "0 1.5rem 0 0",
                        padding: 0,
                        fontSize: 24,
                        fontFamily: "'Bebas Neue', sans-serif",
                      }}
                    >
                      Mitgliederliste
                    </span>
                  </Col>
                  <Col
                    style={{
                      width: window.innerWidth < 768 ? "100%" : "initial",
                    }}
                  >
                    <Segmented
                      options={options}
                      selected={selected}
                      onChange={setSelected}
                      block={window.innerWidth < 768}
                    />
                  </Col>
                </Row>
              </Col>
              {securityClearance > 1 && (
                <Col>
                  {securityClearance < 3 ? (
                    <Dropdown.Button
                      type="primary"
                      menu={{
                        items,
                      }}
                    >
                      Aktionen
                    </Dropdown.Button>
                  ) : (
                    <Dropdown.Button
                      type="primary"
                      onClick={() => setOpenUserCreateModal(true)}
                      menu={{
                        items,
                      }}
                    >
                      Erstellen
                    </Dropdown.Button>
                  )}
                </Col>
              )}
            </Row>
          )}
          columns={MEMBER_TABLE_COLUMNS}
          dataSource={data}
          pagination={
            data?.length > 10
              ? {
                  pageSize: 10,
                  responsive: true,
                  showTotal: () => (
                    <span>{`Insgegsamt: ${data.length} Mitglieder`}</span>
                  ),
                  showSizeChanger: false,
                }
              : false
          }
          loading={!data?.length == null}
          style={{
            padding: "0.5rem",
          }}
          onRow={(record, index) => {
            return {
              onClick: () => {
                if (securityClearance === 1) {
                  setOpenUserDisplayModal([record._id]);
                }
              },
            };
          }}
          rowSelection={
            securityClearance > 1
              ? {
                  type: "checkbox",
                  onChange: (selectedRowKeys, selectedRows) => {
                    setRowSelection({ selectedRows, selectedRowKeys });
                  },
                  selectedRowKeys: rowSelection?.selectedRowKeys || [],
                }
              : false
          }
        />
        <UserCreateModal
          openUserCreateModal={openUserCreateModal}
          setOpenUserCreateModal={setOpenUserCreateModal}
        />
        <UserUpdateModal
          openUserUpdateModal={openUserUpdateModal}
          setOpenUserUpdateModal={setOpenUserUpdateModal}
        />
        <UserDisplayModal
          openUserDisplayModal={openUserDisplayModal}
          setOpenUserDisplayModal={setOpenUserDisplayModal}
        />
        <UserArchiveModal
          openUserArchiveModal={openUserArchiveModal}
          setOpenUserArchiveModal={setOpenUserArchiveModal}
        />
        <UserReactivateModal
          openUserReactivateModal={openUserReactivateModal}
          setOpenUserReactivateModal={setOpenUserReactivateModal}
        />
        <UserDeleteModal
          openUserDeleteModal={openUserDeleteModal}
          setOpenUserDeleteModal={setOpenUserDeleteModal}
        />
        <PasswordResetModal
          open={openPasswordResetModal}
          setOpen={setOpenPasswordResetModal}
          userId={rowSelection?.selectedRowKeys[0]}
        />
      </Col>
    </Row>
  );
};

export default MembersComponent;
