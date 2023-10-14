import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Button, Col, Dropdown, Row, Spin, Table, message } from "antd";
import { SKILLS_COLUMNS } from "./SKILLS_COLUMNS";
import { SkillsCollection } from "../../../../api/SkillsApi";
import SkillsModal from "./SkillsModal";
import AddSkillModal from "./AddSkillModal";

const SkillsComponent = () => {
  const { ready, skills } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    const subSkills = Meteor.subscribe("skills");
    const skills = SkillsCollection.find({}).map((item) => {
      return {
        ...item,
        key: item?._id,
      };
    });
    return {
      ready: sub.ready() && subSkills.ready(),
      skills,
    };
  }, []);
  const [rowSelection, setRowSelection] = useState(null);
  const [open, setOpen] = useState(false);
  const [addContextOpen, setAddContextOpen] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState("Ausbildung");
  const errorText = "Bitte wähle zuerst ein oder mehr Ausbildungen aus!";
  const securityClearance = Meteor.user()?.profile?.securityClearance;
  const items = [
    {
      key: "read",
      label: "Anzeigen",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(true);
          setOpen(true);
          setIsDelete(false);
          setTitle("Ausbildungen anzeigen");
        } else {
          message.warning(errorText);
        }
      },
    },
    securityClearance > 3 && {
      key: "edit",
      label: "Bearbeiten",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false);
          setOpen(true);
          setIsDelete(false);
          setTitle("Ausbildungen bearbeiten");
        } else {
          message.warning(errorText);
        }
      },
    },
    securityClearance > 3 && {
      key: "delete",
      label: "Löschen",
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false);
          setIsDelete(true);
          setOpen(true);
          setTitle("Ausbildungen löschen");
        } else {
          message.warning(errorText);
        }
      },
    },
  ];
  return (
    <Row align="middle">
      <Col span={24}>
        <Spin spinning={!ready}>
          <Table
            scroll={{ x: 150 }}
            title={() => (
              <Row gutter={16} justify="space-between" align="middle">
                <Col flex="auto">
                  <span
                    style={{
                      margin: "0 1.5rem 0 0",
                      padding: 0,
                      fontSize: 24,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    Ausbildungen
                  </span>
                </Col>
                <Col>
                  <Row gutter={8}>
                    {securityClearance > 1 && (
                      <Col>
                        <Button onClick={() => setAddContextOpen(true)}>
                          Ausbildung hinzufügen
                        </Button>
                      </Col>
                    )}
                    {securityClearance > 3 && (
                      <Col>
                        <Dropdown.Button
                          type="primary"
                          onClick={() => {
                            setFormDisabled(false);
                            setIsDelete(false);
                            setOpen(true);
                            setTitle("Ausbildung erstellen");
                            setRowSelection({
                              selectedRows: [],
                              selectedRowKeys: [],
                            });
                          }}
                          menu={{
                            items,
                          }}
                        >
                          Erstellen
                        </Dropdown.Button>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            )}
            style={{ padding: "0.5rem" }}
            dataSource={skills}
            columns={SKILLS_COLUMNS}
            pagination={
              skills?.length > 7
                ? {
                    pageSize: 7,
                    responsive: true,
                    showTotal: () => (
                      <span>{`Insgegsamt: ${skills.length} Ausbildungen`}</span>
                    ),
                    showSizeChanger: false,
                  }
                : false
            }
            rowSelection={
              securityClearance > 3
                ? {
                    type: "checkbox",
                    onChange: (selectedRowKeys, selectedRows) => {
                      setRowSelection({ selectedRows, selectedRowKeys });
                    },
                    selectedRowKeys: rowSelection?.selectedRowKeys || [],
                  }
                : false
            }
            onRow={(record, index) => {
              return {
                onClick: () => {
                  if (securityClearance < 4) {
                    setRowSelection({
                      selectedRows: [record],
                      selectedRowKeys: [record.key],
                    });
                    setTitle("Squad anzeigen");
                    setFormDisabled(true);
                    setOpen(true);
                  } else {
                    setRowSelection({
                      selectedRows: [record],
                      selectedRowKeys: [record.key],
                    });
                    setTitle("Squad bearbeiten");
                    setOpen(true);
                  }
                },
              };
            }}
          />
        </Spin>
      </Col>
      <AddSkillModal
        title="Ausbildung hinzufügen"
        open={addContextOpen}
        setOpen={setAddContextOpen}
      />
      <SkillsModal
        title={title}
        open={open}
        setOpen={setOpen}
        ids={rowSelection?.selectedRowKeys}
        formDisabled={formDisabled}
        isDelete={isDelete}
      />
    </Row>
  );
};

export default SkillsComponent;
