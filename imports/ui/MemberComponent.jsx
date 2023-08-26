import { Col, Dropdown, Row, Segmented, Table, message } from "antd";
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

const MembersComponent = () => {
  const [selected, setSelected] = useState("active");
  const { users } = useTracker(() => {
    const sub = Meteor.subscribe("users");
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
    };
  });
  const [openUserCreateModal, setOpenUserCreateModal] = useState(false);
  const [openUserUpdateModal, setOpenUserUpdateModal] = useState(false);
  const [openUserDisplayModal, setOpenUserDisplayModal] = useState(false);
  const [openUserArchiveModal, setOpenUserArchiveModal] = useState(false);
  const [openUserReactivateModal, setOpenUserReactivateModal] = useState(false);
  const [openUserDeleteModal, setOpenUserDeleteModal] = useState(false);
  const [rowSelection, setRowSelection] = useState(null);
  const options = [
    {
      key: "active",
      value: "active",
      label: "Aktive Mitglieder",
    },
    {
      key: "inactive",
      value: "inactive",
      label: "Inaktive Mitglieder",
    },
  ];
  const data = users;

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
    selected === "active" && {
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
    selected === "inactive" && {
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
    selected === "inactive" && {
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
  ];
  return (
    <Row>
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row justify="space-between" align="middle">
              <Col flex="auto">
                <span
                  style={{
                    margin: "0 1.5rem 0 0",
                    padding: 0,
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  Mitgliederliste
                </span>
                <Segmented
                  options={options}
                  selected={selected}
                  onChange={setSelected}
                />
              </Col>
              <Col>
                <Dropdown.Button
                  type="primary"
                  onClick={() => setOpenUserCreateModal(true)}
                  menu={{
                    items,
                  }}
                >
                  Erstellen
                </Dropdown.Button>
              </Col>
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
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              setRowSelection({ selectedRows, selectedRowKeys });
            },
            selectedRowKeys: rowSelection?.selectedRowKeys || [],
          }}
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
      </Col>
    </Row>
  );
};

export default MembersComponent;
