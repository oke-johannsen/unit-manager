import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { RecruitmentCollection } from "../api/RecruitmentsApi";
import { Col, List, Row, Segmented, message } from "antd";

const RecruitmentComponent = () => {
  const [selected, setSelected] = useState("open");
  const { ready, recruitment } = useTracker(() => {
    const sub = Meteor.subscribe("users");
    const subRecruitments = Meteor.subscribe("recruitments");
    const recruitment = RecruitmentCollection.find({ status: selected }).map(
      (item) => {
        return {
          key: item?._id,
          ...item,
        };
      }
    );
    console.log(recruitment);
    return {
      ready: sub.ready() && subRecruitments.ready(),
      recruitment,
    };
  }, [selected]);
  console.log(selected);
  return (
    <List
      className="recruitment-list"
      header={
        <Row justify="space-between" align="middle">
          <Col>
            <span
              style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Bewerbungen
            </span>
          </Col>
          <Col>
            <Row align="middle" gutter={16}>
              <Col>
                <Segmented
                  value={selected}
                  onChange={setSelected}
                  options={[
                    { value: "open", label: "Offen" },
                    { value: "closed", label: "Abgeschlossen" },
                  ]}
                />
              </Col>
              <Col>Anzahl: {recruitment?.length || 0}</Col>
            </Row>
          </Col>
        </Row>
      }
      loading={!ready}
      dataSource={recruitment || []}
      renderItem={(item) => {
        return (
          <List.Item
            key={item.key}
            actions={[
              <a
                onClick={() => {
                  Meteor.call(
                    "recruitment.update",
                    item.key,
                    {
                      status: selected === "open" ? "closed" : "open",
                    },
                    (err, res) => {
                      if (!err) {
                        message.success("Bewerbung erfolgreich verschoben!");
                      } else {
                        console.error("error in recruitment.remove", err, res);
                        message.error(
                          "Es was ist schief gelaufen, bitte versuche es erneut!"
                        );
                      }
                    }
                  );
                }}
              >
                {selected === "open" ? "Abschließen" : "Wiedereröffnen"}
              </a>,
              <a
                onClick={() => {
                  Meteor.call("recruitment.remove", item.key, (err, res) => {
                    if (!err) {
                      message.success("Bewerbung erfolgreich gelöscht!");
                    } else {
                      console.error("error in recruitment.remove", err, res);
                      message.error(
                        "Es was ist schief gelaufen, bitte versuche es erneut!"
                      );
                    }
                  });
                }}
              >
                Löschen
              </a>,
            ]}
          >
            <List.Item.Meta
              title={item.preferredName}
              description={
                <Row>
                  <Col span={8}>Discord:</Col>
                  <Col span={16}>{item.discordId}</Col>
                  <Col span={8}>Steam:</Col>
                  <Col span={16}>
                    <a href={item.steamProfile} target="_blank">
                      {item.steamProfile}
                    </a>
                  </Col>
                  <Col span={8}>Stunden:</Col>
                  <Col span={16}>{item.amountOfHours}</Col>
                  <Col span={8}>Anwesenheit:</Col>
                  <Col span={16}>{item.attendenceBehaviour}</Col>
                  <Col span={8}>MilSim Erfahrung:</Col>
                  <Col span={16}>{item.experience}</Col>
                  {item.referred && (
                    <>
                      <Col span={8}>Rekrutiert durch:</Col>
                      <Col span={16}>
                        {Meteor.users.findOne(item.referrer)?.profile?.name}
                      </Col>
                    </>
                  )}
                </Row>
              }
            />
          </List.Item>
        );
      }}
      style={{ margin: "2rem" }}
      bordered
    />
  );
};

export default RecruitmentComponent;
