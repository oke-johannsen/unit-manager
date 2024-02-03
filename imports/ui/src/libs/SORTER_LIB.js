const getRankPower = (rank) => {
  return [
    '',
    'Unteroffizier',
    'Bootsmann',
    'Fähnrich (FD)',
    'Feldwebel',
    'Oberbootsmann',
    'Oberfähnrich (FD)',
    'Oberfeldwebel',
    'Hauptbootsmann',
    'Leutnant (FD)',
    'Hauptfeldwebel',
    'Stabsbootsmann',
    'Oberleutnant (FD)',
    'Stabsfeldwebel',
    'Oberstabsbootsmann',
    'Hauptmann (FD)',
    'Oberstabsfeldwebel',
    'Leutnant zur See',
    'Leutnant',
    'Oberleutnant zur See',
    'Oberleutnant',
    'Kapitänleutnant',
    'Hauptmann',
    'Major',
  ].indexOf(rank)
}

export const sortByRank = (rankA, rankB) => {
  return getRankPower(rankB) - getRankPower(rankA)
}
