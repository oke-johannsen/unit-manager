import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { UsersCollection } from "../imports/api/UsersApi";
import "../imports/api/UsersApi";
import "../imports/api/AttendenceApi";
import "../imports/api/LoggingApi";
import "../imports/api/SquadApi";
import "../imports/api/RecruitmentsApi";
import "../imports/api/SkillsApi";

Meteor.startup(async () => {
  const defaultAdmin = UsersCollection.findOne({ username: "mando" });
  const defaultServiceUser = UsersCollection.findOne({
    username: "service-admin",
  });
  if (!defaultAdmin) {
    Accounts.createUser({
      username: "mando",
      password: "Test-123*",
      profile: {
        name: "Oke Johannsen",
        tier: null,
        rank: null,
        designation: null,
        squadPosition: null,
        securityClearance: 4,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
        promitionHistory: [],
      },
    });
  }
  if (!defaultServiceUser) {
    Accounts.createUser({
      username: "service-admin",
      password: "tJ7n89J2vum8yWKV6U88",
      profile: {
        name: "TF11 Service Account",
        tier: null,
        rank: null,
        designation: null,
        squadPosition: null,
        securityClearance: 4,
        points: 0,
        inactivityPoints: 0,
        trainings: 0,
        missions: 0,
        skills: [],
        promitionHistory: [],
      },
    });
  }
});
