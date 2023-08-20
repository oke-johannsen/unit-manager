import { Col, Dropdown, Row, Table } from "antd";
import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { MEMBER_TABLE_COLUMNS } from "./MEMBER_TABLE_COLUMNS";
import UserCreateModal from "./UserCreateModal";
import UserUpdateModal from "./UserUpdateModal";

const MembersComponent = () => {
  const { users } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    return {
      users: sub.ready()
        ? Meteor.users.find().map((user) => {
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
  const [rowSelection, setRowSelection] = useState(null);
  const data = users;
  const items = [
    {
      key: "read",
      label: "Anzeigen",
    },
    {
      key: "edit",
      label: "Bearbeiten",
      onClick: () => setOpenUserUpdateModal(rowSelection.selectedRowKeys[0]),
    },
    {
      key: "archive",
      label: "Archivieren",
    },
  ];
  return (
    <Row>
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row justify="space-between">
              <Col>
                <h3 style={{ margin: 0, padding: 0 }}>Mitgliederliste</h3>
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
      </Col>
    </Row>
  );
};

export default MembersComponent;
