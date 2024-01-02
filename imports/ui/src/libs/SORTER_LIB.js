export const ranks = [
  '',
  'Unteroffizier',
  'Bootsmann',
  'Feldwebel',
  'Oberbootsmann',
  'Oberfeldwebel',
  'Hauptbootsmann',
  'Hauptfeldwebel',
  'Stabsbootsmann',
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
