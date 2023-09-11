import { Col, List, Modal, Row, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { SquadCollection } from "../api/SquadApi";
import SquadForm from "./SquadForm";
import { Meteor } from "meteor/meteor";

const SquadModal = ({ open, setOpen, ids, title, formDisabled, isDelete }) => {
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
          Meteor.call("squad.remove", id, (err, res) => {
            if (!err) {
              if (index === ids.length - 1) {
                setForm(undefined);
                setForms({});
                message.success("Trupps wurden erfolgreich gelöscht!");
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
            Meteor.call("squad.update", id, forms[id], (err, res) => {
              if (!err) {
                if (index === ids.length - 1) {
                  setForm(undefined);
                  setForms({});
                  message.success("Trupps wurden erfolgreich erstellt!");
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
      Meteor.call("squad.create", form, (err, res) => {
        if (!err) {
          setForm(undefined);
          setForms({});
          message.success("Trupp wurde erfolgreich erstellt!");
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
              {ids.length === 1 ? "Trupp" : "Trupps"} löschen möchtest?
            </Col>
            <List
              dataSource={SquadCollection.find({ _id: { $in: ids } }).fetch()}
              style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
              renderItem={(item) => {
                const squad = SquadCollection.findOne(item);
                return (
                  <Row style={{ width: "100%" }}>
                    <Col xs={12} sm={12} md={8} lg={8} xl={4} xxl={4}>
                      {squad?.squadName}:
                    </Col>
                    <Col flex="auto">
                      {squad?.squadMember?.length}{" "}
                      {squad?.squadMember?.length === 1
                        ? "Mitglied"
                        : "Mitglieder"}
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
                label: SquadCollection.findOne(id)?.squadName,
                children: (
                  <SquadForm
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
        <SquadForm
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

export default SquadModal;
