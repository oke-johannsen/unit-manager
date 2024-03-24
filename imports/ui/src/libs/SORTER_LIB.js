export const ranks = [
  '-',
  'Unteroffizier',
  'Fähnricht (FD)',
  'Bootsmann',
  'Feldwebel',
  'Oberfähnrich (FD)',
  'Oberbootsmann',
  'Oberfeldwebel',
  'Leutnant (FD)',
  'Hauptbootsmann',
  'Oberleutnant (FD)',
  'Hauptfeldwebel',
  'Stabsbootsmann',
  'Hauptmann (FD)',
  'Stabsfeldwebel',
  'Oberstabsbootsmann',
  'Oberstabsfeldwebel',
  'Leutnant zur See',
  'Leutnant',
  'Oberleutnant zur See',
  'Oberleutnant',
  'Kapitänleutnant',
  'Hauptmann',
  'Major',
]

const getRankPower = (rank) => {
  return ranks.indexOf(rank)
}

export const sortByRank = (rankA, rankB) => {
  return getRankPower(rankB) - getRankPower(rankA)
}

export const sortByNumber = (a, b, direction) => {
  return direction === 1 ? a - b : b - a
}
