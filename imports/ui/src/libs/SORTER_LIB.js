export const ranks = [
  { value: '-', label: 'Keinen Dienstgrad' },
  { value: 'Unteroffizier', label: 'Maat' },
  { value: 'Fähnrich (FD)', label: 'Fähnricht (FD)' },
  { value: 'Bootsmann', label: 'Bootsmann' },
  { value: 'Oberfähnrich (FD)', label: 'Oberfähnrich (FD)' },
  { value: 'Oberbootsmann', label: 'Oberbootsmann' },
  { value: 'Leutnant (FD)', label: 'Leutnant (FD)' },
  { value: 'Hauptbootsmann', label: 'Hauptbootsmann' },
  { value: 'Oberfähnrich zur See', label: 'Oberfähnrich zur See' },
  { value: 'Oberleutnant (FD)', label: 'Oberleutnant (FD)' },
  { value: 'Stabsbootsmann', label: 'Stabsbootsmann' },
  { value: 'Hauptmann (FD)', label: 'Hauptmann (FD)' },
  { value: 'Oberstabsbootsmann', label: 'Oberstabsbootsmann' },
  { value: 'Leutnant zur See', label: 'Leutnant zur See' },
  { value: 'Oberleutnant zur See', label: 'Oberleutnant zur See' },
  { value: 'Kapitänleutnant', label: 'Kapitänleutnant' },
]

const getRankPower = (rankValue) => {
  return ranks.findIndex((r) => r.value === rankValue)
}

export const sortByRank = (rankA, rankB) => {
  return getRankPower(rankB) - getRankPower(rankA)
}

export const sortByNumber = (a, b, direction) => {
  return direction === 1 ? a - b : b - a
}
