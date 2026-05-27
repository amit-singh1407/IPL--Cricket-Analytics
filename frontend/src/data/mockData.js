export const mockDashboardData = {
  summaryCards: [
    { label: 'Teams', value: 10, description: 'Active franchises tracked', trend: '+2 seasons' },
    { label: 'Players', value: 184, description: 'Profiled batters and bowlers', trend: '+14% this season' },
    { label: 'Matches', value: 74, description: 'Historical match records', trend: '+6 compared to last update' },
    { label: 'Avg Win %', value: '52.4%', description: 'Across tracked teams', trend: 'Top form rising' },
  ],
  charts: {
    winPercentage: [
      { name: 'CSK', value: 68 },
      { name: 'MI', value: 61 },
      { name: 'KKR', value: 58 },
      { name: 'RCB', value: 54 },
      { name: 'RR', value: 53 },
      { name: 'SRH', value: 49 },
    ],
    battingAverage: [
      { name: 'Virat Kohli', value: 37.8 },
      { name: 'Suryakumar Yadav', value: 34.1 },
      { name: 'Ruturaj Gaikwad', value: 41.2 },
      { name: 'Jos Buttler', value: 39.5 },
      { name: 'Shubman Gill', value: 36.4 },
    ],
    strikeRate: [
      { name: 'Andre Russell', value: 176 },
      { name: 'Heinrich Klaasen', value: 168 },
      { name: 'Nicholas Pooran', value: 164 },
      { name: 'Rinku Singh', value: 151 },
      { name: 'Glenn Maxwell', value: 147 },
    ],
    tossImpact: [
      { name: 'Chase', value: 58 },
      { name: 'Defend', value: 42 },
    ],
    venuePerformance: [
      { name: 'Wankhede', value: 64 },
      { name: 'Chepauk', value: 69 },
      { name: 'Eden Gardens', value: 57 },
      { name: 'Chinnaswamy', value: 52 },
      { name: 'Narendra Modi', value: 55 },
    ],
  },
  recentMatches: [
    { id: 'm-101', team1: 'CSK', team2: 'MI', venue: 'Chepauk', winner: 'CSK', margin: '18 runs', season: '2025' },
    { id: 'm-102', team1: 'RCB', team2: 'KKR', venue: 'Chinnaswamy', winner: 'KKR', margin: '4 wickets', season: '2025' },
    { id: 'm-103', team1: 'RR', team2: 'SRH', venue: 'Jaipur', winner: 'RR', margin: '9 runs', season: '2024' },
    { id: 'm-104', team1: 'GT', team2: 'DC', venue: 'Ahmedabad', winner: 'GT', margin: '6 wickets', season: '2025' },
  ],
  topPlayers: [
    { id: 'p-1', name: 'Virat Kohli', team: 'RCB', runs: 741, strikeRate: 153.4, battingAverage: 38.9 },
    { id: 'p-2', name: 'Ruturaj Gaikwad', team: 'CSK', runs: 686, strikeRate: 145.1, battingAverage: 41.2 },
    { id: 'p-3', name: 'Andre Russell', team: 'KKR', runs: 472, strikeRate: 176.8, battingAverage: 32.5 },
    { id: 'p-4', name: 'Jasprit Bumrah', team: 'MI', runs: 72, strikeRate: 118.4, battingAverage: 9.4 },
  ],
  topTeams: [
    { id: 't-1', name: 'Chennai Super Kings', shortName: 'CSK', played: 74, won: 50, winPercentage: 67.6, tossImpact: 61.2 },
    { id: 't-2', name: 'Mumbai Indians', shortName: 'MI', played: 72, won: 44, winPercentage: 61.1, tossImpact: 55.8 },
    { id: 't-3', name: 'Kolkata Knight Riders', shortName: 'KKR', played: 71, won: 39, winPercentage: 54.9, tossImpact: 50.2 },
    { id: 't-4', name: 'Royal Challengers Bengaluru', shortName: 'RCB', played: 70, won: 38, winPercentage: 54.3, tossImpact: 49.6 },
  ],
  insights: [
    'Chepauk remains the strongest chase venue for the tracked teams.',
    'Top-order batters with strike rate above 150 are producing the highest win shares.',
    'Teams winning the toss and fielding first convert slightly better than average.',
  ],
  liveScores: [
    { match: 'CSK vs MI', score: '168/6', overs: '20.0', status: 'Final' },
    { match: 'RCB vs KKR', score: '145/8', overs: '20.0', status: 'Final' },
    { match: 'RR vs SRH', score: '179/5', overs: '20.0', status: 'Final' },
  ],
};

export const mockTeams = [
  { id: 't-1', teamId: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', city: 'Chennai', colors: ['#facc15', '#f59e0b'], played: 74, won: 50, lost: 24, winPercentage: 67.6, tossImpact: 61.2, venue: 'Chepauk' },
  { id: 't-2', teamId: 'mi', name: 'Mumbai Indians', shortName: 'MI', city: 'Mumbai', colors: ['#0ea5e9', '#1d4ed8'], played: 72, won: 44, lost: 28, winPercentage: 61.1, tossImpact: 55.8, venue: 'Wankhede' },
  { id: 't-3', teamId: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', city: 'Kolkata', colors: ['#7c3aed', '#111827'], played: 71, won: 39, lost: 32, winPercentage: 54.9, tossImpact: 50.2, venue: 'Eden Gardens' },
  { id: 't-4', teamId: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', city: 'Bengaluru', colors: ['#ef4444', '#111827'], played: 70, won: 38, lost: 32, winPercentage: 54.3, tossImpact: 49.6, venue: 'Chinnaswamy' },
  { id: 't-5', teamId: 'rr', name: 'Rajasthan Royals', shortName: 'RR', city: 'Jaipur', colors: ['#ec4899', '#8b5cf6'], played: 68, won: 37, lost: 31, winPercentage: 54.4, tossImpact: 51.1, venue: 'Sawai Mansingh' },
  { id: 't-6', teamId: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', city: 'Hyderabad', colors: ['#f97316', '#facc15'], played: 68, won: 33, lost: 35, winPercentage: 48.5, tossImpact: 44.8, venue: 'Rajiv Gandhi' },
];

export const mockPlayers = [
  { id: 'p-1', playerId: 'virat-kohli', name: 'Virat Kohli', teamId: 'rcb', role: 'Batter', battingAverage: 38.9, strikeRate: 153.4, economyRate: 0, consistency: 91, runs: 741, balls: 483 },
  { id: 'p-2', playerId: 'ruturaj-gaikwad', name: 'Ruturaj Gaikwad', teamId: 'csk', role: 'Batter', battingAverage: 41.2, strikeRate: 145.1, economyRate: 0, consistency: 88, runs: 686, balls: 472 },
  { id: 'p-3', playerId: 'andre-russell', name: 'Andre Russell', teamId: 'kkr', role: 'All-rounder', battingAverage: 32.5, strikeRate: 176.8, economyRate: 8.1, consistency: 84, runs: 472, balls: 267 },
  { id: 'p-4', playerId: 'jasprit-bumrah', name: 'Jasprit Bumrah', teamId: 'mi', role: 'Bowler', battingAverage: 9.4, strikeRate: 118.4, economyRate: 6.7, consistency: 90, runs: 72, balls: 61 },
  { id: 'p-5', playerId: 'shubman-gill', name: 'Shubman Gill', teamId: 'gt', role: 'Batter', battingAverage: 36.4, strikeRate: 144.2, economyRate: 0, consistency: 87, runs: 633, balls: 439 },
  { id: 'p-6', playerId: 'jos-buttler', name: 'Jos Buttler', teamId: 'rr', role: 'Batter', battingAverage: 39.5, strikeRate: 149.8, economyRate: 0, consistency: 82, runs: 598, balls: 399 },
];

export const mockMatches = [
  { id: 'm-101', matchId: 'ipl-2025-001', season: '2025', team1Id: 'csk', team2Id: 'mi', team1: 'CSK', team2: 'MI', venue: 'Chepauk', winner: 'CSK', winnerId: 'csk', tossWinnerId: 'mi', tossDecision: 'field', margin: '18 runs', score: '184/5 - 166/8' },
  { id: 'm-102', matchId: 'ipl-2025-002', season: '2025', team1Id: 'rcb', team2Id: 'kkr', team1: 'RCB', team2: 'KKR', venue: 'Chinnaswamy', winner: 'KKR', winnerId: 'kkr', tossWinnerId: 'rcb', tossDecision: 'bat', margin: '4 wickets', score: '153/7 - 154/6' },
  { id: 'm-103', matchId: 'ipl-2024-013', season: '2024', team1Id: 'rr', team2Id: 'srh', team1: 'RR', team2: 'SRH', venue: 'Jaipur', winner: 'RR', winnerId: 'rr', tossWinnerId: 'srh', tossDecision: 'field', margin: '9 runs', score: '179/5 - 170/8' },
  { id: 'm-104', matchId: 'ipl-2025-005', season: '2025', team1Id: 'gt', team2Id: 'dc', team1: 'GT', team2: 'DC', venue: 'Ahmedabad', winner: 'GT', winnerId: 'gt', tossWinnerId: 'dc', tossDecision: 'field', margin: '6 wickets', score: '172/4 - 169/9' },
];
