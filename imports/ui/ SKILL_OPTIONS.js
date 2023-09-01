export const getTagColorByValue = (value) => {
  let color;
  switch (value) {
    case "CFR Bravo":
    case "Spezialaufklärung":
      color = "magenta";
      break;
    case "Gruppenscharfschütze":
    case "Einzelkämpfer":
      color = "red";
      break;
    case "PzFst/40mm":
    case "Taktisches CQB":
      color = "volcano";
      break;
    case "MG-Schütze":
    case "CFR Charlie":
      color = "orange";
      break;
    case "UAV Operator":
    case "Scharfschütze":
      color = "gold";
      break;
    case "Fernmelder":
    case "JTAC":
      color = "lime";
      break;
    case "CQB":
    case "Pilot":
      color = "green";
      break;
    case "Fahrzeuge":
    case "TOC":
      color = "cyan";
      break;
    case "Taktik":
    case "Truppführung":
      color = "blue";
      break;
    case "Ausrüstung":
      color = "geekblue";
      break;
    case "Tauchen/Amphibische Kriegsführung":
      color = "purple";
      break;
    default:
      break;
  }
  return color;
};

export const SKILL_OPTIONS = [
  {
    value: "CFR Bravo",
    label: "CFR Bravo",
  },
  {
    value: "Gruppenscharfschütze",
    label: "Gruppenscharfschütze",
  },
  {
    value: "PzFst/40mm",
    label: "PzFst/40mm",
  },
  {
    value: "MG-Schütze",
    label: "MG-Schütze",
  },
  {
    value: "UAV Operator",
    label: "UAV Operator",
  },
  {
    value: "Fernmelder",
    label: "Fernmelder",
  },
  {
    value: "CQB",
    label: "CQB",
  },
  {
    value: "Fahrzeuge",
    label: "Fahrzeuge",
  },
  {
    value: "Taktik",
    label: "Taktik",
  },
  {
    value: "Ausrüstung",
    label: "Ausrüstung",
  },
  {
    value: "Tauchen/Amphibische Kriegsführung",
    label: "Tauchen/Amphibische Kriegsführung",
  },
  {
    value: "Spezialaufklärung",
    label: "Spezialaufklärung",
  },
  {
    value: "Einzelkämpfer",
    label: "Einzelkämpfer",
  },
  {
    value: "Taktisches CQB",
    label: "Taktisches CQB",
  },
  {
    value: "CFR Charlie",
    label: "CFR Charlie",
  },
  {
    value: "Scharfschütze",
    label: "Scharfschütze",
  },
  {
    value: "JTAC",
    label: "JTAC",
  },
  {
    value: "Pilot",
    label: "Pilot",
  },
  {
    value: "TOC",
    label: "TOC",
  },
  {
    value: "Truppführung",
    label: "Truppführung",
  },
];
