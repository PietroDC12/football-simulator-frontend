import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
})

export const getCompetitions = () => api.get('/competitions')
export const getTeams = (competitionId) => api.get(`/competitions/${competitionId}/teams`)
export const simulateMatch = (homeTeamId, awayTeamId, format) =>
  api.post('/match', { homeTeamId, awayTeamId, format })