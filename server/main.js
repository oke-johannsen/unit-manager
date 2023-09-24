import { Meteor } from "meteor/meteor";
import "../imports/api/UsersApi";
import "../imports/api/AttendenceApi";
import "../imports/api/LoggingApi";
import "../imports/api/SquadApi";
import "../imports/api/RecruitmentsApi";
import "../imports/api/SkillsApi";
import { UsersCollection } from "../imports/api/UsersApi";
import { Accounts } from "meteor/accounts-base";

Meteor.startup(async () => {
  const defaultAdmin = UsersCollection.findOne({ username: "mando" });
  if (!defaultAdmin) {
    Accounts.createUser({
      username: "mando",
      password: "Test-123*",
      profile: {
        name: "Oke Johannsen",
        tier: 1,
        rank: "Unteroffizier",
        designation: "KSK",
        squadPosition: "Mannschaftler",
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
