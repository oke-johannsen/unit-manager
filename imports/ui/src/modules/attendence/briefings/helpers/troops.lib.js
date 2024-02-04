const troops = [
  {
    label: 'Kommandant',
    name: 'commander',
    nodes: [{ key: 'commander-01', callsign: 'TF-11' }],
  },
  {
    label: 'Führungsunterstützung - (JSFT)',
    name: 'jsft',
    nodes: [
      { key: 'jsft-01', callsign: 'JSFT' },
      { key: 'jsft-02', callsign: 'JSFT' },
      { key: 'jsft-03', callsign: 'JSFT' },
      { key: 'jsft-04', callsign: 'JSFT' },
    ],
  },
  {
    label: 'Tactical Operation Center',
    name: 'toc',
    nodes: [
      { key: 'toc-01', callsign: 'TOC' },
      { key: 'toc-02', callsign: 'TOC' },
      { key: 'toc-03', callsign: 'TOC' },
      { key: 'toc-04', callsign: 'TOC' },
    ],
  },
  {
    label: 'Alpha',
    name: 'alpha',
    nodes: [
      { key: 'alpha-01', callsign: 'Alpha-1' },
      { key: 'alpha-02', callsign: 'Alpha-2' },
      { key: 'alpha-03', callsign: 'Alpha-3' },
      { key: 'alpha-04', callsign: 'Alpha-4' },
      { key: 'alpha-05', callsign: 'Alpha-5' },
      { key: 'alpha-06', callsign: 'Alpha-6' },
    ],
  },
  {
    label: 'Bravo',
    name: 'bravo',
    nodes: [
      { key: 'bravo-01', callsign: 'Bravo-1' },
      { key: 'bravo-02', callsign: 'Bravo-2' },
      { key: 'bravo-03', callsign: 'Bravo-3' },
      { key: 'bravo-04', callsign: 'Bravo-4' },
      { key: 'bravo-05', callsign: 'Bravo-5' },
      { key: 'bravo-06', callsign: 'Bravo-6' },
    ],
  },
  {
    label: 'Charlie',
    name: 'charlie',
    nodes: [
      { key: 'charlie-01', callsign: 'Charlie-1' },
      { key: 'charlie-02', callsign: 'Charlie-2' },
      { key: 'charlie-03', callsign: 'Charlie-3' },
      { key: 'charlie-04', callsign: 'Charlie-4' },
      { key: 'charlie-05', callsign: 'Charlie-5' },
      { key: 'charlie-06', callsign: 'Charlie-6' },
    ],
  },
  {
    label: 'Delta',
    name: 'delta',
    nodes: [
      { key: 'delta-01', callsign: 'Delta-1' },
      { key: 'delta-02', callsign: 'Delta-2' },
      { key: 'delta-03', callsign: 'Delta-3' },
      { key: 'delta-04', callsign: 'Delta-4' },
      { key: 'delta-05', callsign: 'Delta-5' },
      { key: 'delta-06', callsign: 'Delta-6' },
    ],
  },
  {
    label: 'Echo',
    name: 'echo',
    nodes: [
      { key: 'echo-01', callsign: 'Echo-1' },
      { key: 'echo-02', callsign: 'Echo-2' },
      { key: 'echo-03', callsign: 'Echo-3' },
      { key: 'echo-04', callsign: 'Echo-4' },
      { key: 'echo-05', callsign: 'Echo-5' },
      { key: 'echo-06', callsign: 'Echo-6' },
    ],
  },
]

const orders = [
  {
    label: 'Rahmenlage',
    name: 'ramification',
  },
  {
    label: 'Lage Feind',
    name: 'enemySituation',
  },
  {
    label: 'Lage Eigen',
    name: 'friendlySituation',
  },
  {
    label: 'Lage Zivil',
    name: 'civilSituation',
  },
  {
    label: 'Lage GEO',
    name: 'geoSituation',
  },
  {
    label: 'Auftrag',
    name: 'orders',
  },
  {
    label: 'Durchführung',
    name: 'execution',
  },
  {
    label: 'Einsatzunterstützung',
    name: 'support',
  },
  {
    label: 'Führungsunterstützung',
    name: 'leadershipSupport',
  },
]

export { troops, orders }
