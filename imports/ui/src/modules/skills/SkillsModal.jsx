import { Badge, Col, List, Modal, Row, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import SkillsForm from "./SkillsForm";
import { SkillsCollection } from "../../../../api/SkillsApi";

const SkillModal = ({ open, setOpen, ids, title, formDisabled, isDelete }) => {
  const [forms, setForms] = useState({});
  const [form, setForm] = useState(undefined);
  const [activeKey, setActiveKey] = useState(null);
  useEffect(() => {
    if (ids?.length) {
      setActiveKey(ids[0]);
    } else {
      setActiveKey(null);
    }
  }, [ids]);
  const handleSubmit = () => {
    if (ids?.length) {
      ids.forEach((id, index) => {
        if (isDelete) {
          Meteor.call("skills.remove", id, (err, res) => {
            if (!err) {
              if (index === ids.length - 1) {
                setForm(undefined);
                setForms({});
                message.success("Ausbildungen wurden erfolgreich gelöscht!");
                setOpen(false);
              }
            } else {
              message.error(
                "Etwas ist schief gelaufen, bitte versuche es erneut!"
              );
              console.error(err, res);
            }
          });
        } else {
          if (forms[id]) {
            Meteor.call("skills.update", id, forms[id], (err, res) => {
              if (!err) {
                if (index === ids.length - 1) {
                  setForm(undefined);
                  setForms({});
                  message.success("Ausbildungen wurden erfolgreich erstellt!");
                  setOpen(false);
                }
              } else {
                message.error(
                  "Etwas ist schief gelaufen, bitte versuche es erneut!"
                );
                console.error(err, res);
              }
            });
          }
        }
      });
    } else {
      Meteor.call("skills.create", form, (err, res) => {
        if (!err) {
          setForm(undefined);
          setForms({});
          message.success("Ausbildung wurde erfolgreich erstellt!");
          setOpen(false);
        } else {
          message.error("Etwas ist schief gelaufen, bitte versuche es erneut!");
          console.error(err, res);
        }
      });
    }
  };
  const handleFormChange = (payload) => {
    if (ids?.length) {
      const formsCopy = { ...forms };
      formsCopy[activeKey] = payload;
      setForms(formsCopy);
    } else {
      setForm(payload);
    }
  };
  const getModalContent = () => {
    let body;
    if (ids?.length) {
      if (isDelete) {
        body = (
          <Row>
            <Col>
              Bist du sicher, dass du {ids.length}{" "}
              {ids.length === 1 ? "Ausbildung" : "Ausbildungen"} löschen
              möchtest?
            </Col>
            <List
              dataSource={SkillsCollection.find({ _id: { $in: ids } }).fetch()}
              style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
              renderItem={(item) => {
                const skill = SkillsCollection.findOne(item._id);
                return (
                  <Row style={{ width: "100%" }} align="middle" gutter={8}>
                    <Col>
                      <Badge color={skill?.color || "#ccc"} />
                    </Col>
                    <Col>{skill?.name}:</Col>
                    <Col flex="auto">
                      {skill?.trainers?.length}
                      {"  Ausbilder"}
                    </Col>
                  </Row>
                );
              }}
            />
          </Row>
        );
      } else {
        body = (
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={ids?.map((id) => {
              return {
                key: id,
                label: SkillsCollection.findOne(id)?.name,
                children: (
                  <SkillsForm
                    id={id}
                    handleFormChange={handleFormChange}
                    handleSubmit={handleSubmit}
                    formDisabled={formDisabled}
                  />
                ),
              };
            })}
          />
        );
      }
    } else {
      body = (
        <SkillsForm
          handleFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      );
    }
    return body;
  };
  return (
    <Modal
      open={open}
      title={title}
      okText={isDelete ? "Löschen" : "Speichern"}
      okButtonProps={{
        danger: isDelete,
      }}
      onOk={handleSubmit}
      cancelText="Abbrechen"
      onCancel={() => setOpen(false)}
      footer={formDisabled ? false : undefined}
      centered={window.innerWidth < 768}
      destroyOnClose
    >
      {getModalContent()}
    </Modal>
  );
};

export default SkillModal;
