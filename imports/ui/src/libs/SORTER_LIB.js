const getRankPower = (rank) => {
  return [
    "",
    "Unteroffizier",
    "Feldwebel",
    "Oberbootsmann",
    "Oberfeldwebel",
    "Hauptbootsmann",
    "Hauptfeldwebel",
    "Stabsbootsmann",
    "Stabsfeldwebel",
    "Oberstabsbootsmann",
    "Oberstabsfeldwebel",
    "Leutnant zur See",
    "Leutnant",
    "Oberleutnant zur See",
    "Oberleutnant",
    "Kapitänleutnant",
    "Hauptmann",
    "Major",
  ].indexOf(rank);
};

export const sortByRank = (rankA, rankB) => {
  return getRankPower(rankA) > getRankPower(rankB);
};
