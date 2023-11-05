import {
  Col,
  Dropdown,
  Input,
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
import PasswordResetModal from "../../layout/common/PasswordResetModal";

const MembersComponent = () => {
  const [selected, setSelected] = useState("active");
  const { users } = useTracker(() => {
    const sub = Meteor.subscribe("users", {});
    const squadSub = Meteor.subscribe("squads");
    const skillsSub = Meteor.subscribe("skills");
    const status = selected;
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
  }, [selected]);
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);
  const [openUserUpdateModal, setOpenUserUpdateModal] = useState(false);
  const [openUserDisplayModal, setOpenUserDisplayModal] = useState(false);
  const [openUserArchiveModal, setOpenUserArchiveModal] = useState(false);
  const [openUserReactivateModal, setOpenUserReactivateModal] = useState(false);
  const [openUserDeleteModal, setOpenUserDeleteModal] = useState(false);
  const [openPasswordResetModal, setOpenPasswordResetModal] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const [search, setSearch] = useState("");
  const options = [
    {
      key: "active",
      value: "active",
      label: "Aktiv",
    },
    {
      key: "new",
      value: "new",
      label: "Anwärter",
    },
    {
      key: "inactive",
      value: "inactive",
      label: "Inaktiv",
    },
  ];
  const data = users?.filter((user) => {
    const userProfile = user?.profile;
    return (
      userProfile?.name?.toLowerCase().includes(search?.toLowerCase()) ||
      userProfile?.rank?.toLowerCase().includes(search?.toLowerCase())
    );
  });
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance);
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
    (selected === "inactive" || selected === "new") &&
      securityClearance > 3 && {
        key: "reactivate",
        label: selected === "new" ? "Aktivieren" : "Reaktivieren",
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
            if (
              Meteor.users.findOne(rowSelection?.selectedRowKeys[0])?.profile
                ?.securityClearance > 3
            ) {
              Meteor.user()?.username === "service-admin"
                ? setOpenPasswordResetModal(rowSelection.selectedRowKeys)
                : message.error(
                    "Um die Passwörter anderer Administratoren zu verändern, verwende bitte den 'service-admin' Account!"
                  );
            } else {
              setOpenPasswordResetModal(rowSelection.selectedRowKeys);
            }
          }
        } else {
          message.warning("Bitte wähle zuerst ein Mitglied aus!");
        }
      },
    },
  ];
  return (
    <Row>
      {selected === "active" && window.innerWidth > 700 && (
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
                      value={selected}
                      onChange={setSelected}
                      block={window.innerWidth < 768}
                    />
                  </Col>
                  {window.innerWidth > 700 && (
                    <Col>
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Mitglieder suchen"
                      />
                    </Col>
                  )}
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
            data?.length > 7
              ? {
                  pageSize: 7,
                  responsive: true,
                  showSizeChanger: false,
                }
              : false
          }
          loading={!data?.length == null}
          style={{
            padding: "0.5rem",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                if (securityClearance === 1) {
                  setOpenUserDisplayModal([record._id]);
                } else {
                  setOpenUserUpdateModal([record._id]);
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
        {openUserCreateModal && (
          <UserCreateModal
            openUserCreateModal={openUserCreateModal}
            setOpenUserCreateModal={setOpenUserCreateModal}
          />
        )}
        {openUserUpdateModal && (
          <UserUpdateModal
            openUserUpdateModal={openUserUpdateModal}
            setOpenUserUpdateModal={setOpenUserUpdateModal}
          />
        )}
        {openUserDisplayModal && (
          <UserDisplayModal
            openUserDisplayModal={openUserDisplayModal}
            setOpenUserDisplayModal={setOpenUserDisplayModal}
          />
        )}
        {openUserArchiveModal && (
          <UserArchiveModal
            openUserArchiveModal={openUserArchiveModal}
            setOpenUserArchiveModal={setOpenUserArchiveModal}
          />
        )}
        {openUserReactivateModal && (
          <UserReactivateModal
            openUserReactivateModal={openUserReactivateModal}
            setOpenUserReactivateModal={setOpenUserReactivateModal}
          />
        )}
        {openUserDeleteModal && (
          <UserDeleteModal
            openUserDeleteModal={openUserDeleteModal}
            setOpenUserDeleteModal={setOpenUserDeleteModal}
          />
        )}
        {openPasswordResetModal && (
          <PasswordResetModal
            open={openPasswordResetModal}
            setOpen={setOpenPasswordResetModal}
            userId={rowSelection?.selectedRowKeys[0]}
          />
        )}
      </Col>
    </Row>
  );
};

export default MembersComponent;
