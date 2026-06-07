import { useState, useEffect } from 'react'
import { getCompetitions, getTeams, simulateMatch } from '../api'

export default function SelectScreen({ onMatchStart }) {
  const [competitions, setCompetitions] = useState([])
  const [homeComp, setHomeComp] = useState('')
  const [awayComp, setAwayComp] = useState('')
  const [homeTeams, setHomeTeams] = useState([])
  const [awayTeams, setAwayTeams] = useState([])
  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [format, setFormat] = useState('90')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCompetitions().then(res => setCompetitions(res.data))
  }, [])

  async function handleHomeComp(e) {
    const id = e.target.value
    setHomeComp(id)
    setHomeTeamId('')
    setHomeTeams([])
    if (id) {
      const res = await getTeams(id)
      setHomeTeams(res.data)
    }
  }

  async function handleAwayComp(e) {
    const id = e.target.value
    setAwayComp(id)
    setAwayTeamId('')
    setAwayTeams([])
    if (id) {
      const res = await getTeams(id)
      setAwayTeams(res.data)
    }
  }

  async function handleStart() {
    setError('')
    setLoading(true)
    try {
      const res = await simulateMatch(homeTeamId, awayTeamId, format)
      onMatchStart(res.data)
    } catch (err) {
      setError('Erro ao simular partida. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const homeTeam = homeTeams.find(t => t.id === homeTeamId)
  const awayTeam = awayTeams.find(t => t.id === awayTeamId)
  const canStart = homeTeamId && awayTeamId && homeTeamId !== awayTeamId && !loading

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div style={styles.headerIcon}>⚽</div>
        <h1 style={styles.headerTitle}>Simulador de Futebol</h1>
        <p style={styles.headerSub}>Escolha os times e o formato da partida</p>
      </div>

      <div style={styles.body}>

        {/* Time da casa */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>
            <span style={{...styles.dot, background: '#1a472a'}} />
            Time da casa
          </div>

          <label style={styles.label}>Campeonato</label>
          <select style={styles.select} value={homeComp} onChange={handleHomeComp}>
            <option value=''>Selecione o campeonato…</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label style={{...styles.label, marginTop: 10}}>Time</label>
          <select
            style={styles.select}
            value={homeTeamId}
            onChange={e => setHomeTeamId(e.target.value)}
            disabled={!homeComp}
          >
            <option value=''>
              {homeComp ? 'Selecione o time…' : 'Selecione o campeonato primeiro…'}
            </option>
            {homeTeams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {homeTeam && (
            <div style={styles.preview}>
              <div style={{...styles.badge, background: '#e8f5e9', color: '#1a472a'}}>
                {homeTeam.short}
              </div>
              <span style={styles.previewName}>{homeTeam.name}</span>
            </div>
          )}
        </div>

        <div style={styles.vs}>vs</div>

        {/* Visitante */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>
            <span style={{...styles.dot, background: '#8b1a1a'}} />
            Visitante
          </div>

          <label style={styles.label}>Campeonato</label>
          <select style={styles.select} value={awayComp} onChange={handleAwayComp}>
            <option value=''>Selecione o campeonato…</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label style={{...styles.label, marginTop: 10}}>Time</label>
          <select
            style={styles.select}
            value={awayTeamId}
            onChange={e => setAwayTeamId(e.target.value)}
            disabled={!awayComp}
          >
            <option value=''>
              {awayComp ? 'Selecione o time…' : 'Selecione o campeonato primeiro…'}
            </option>
            {awayTeams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {awayTeam && (
            <div style={styles.preview}>
              <div style={{...styles.badge, background: '#fce4e4', color: '#8b1a1a'}}>
                {awayTeam.short}
              </div>
              <span style={styles.previewName}>{awayTeam.name}</span>
            </div>
          )}
        </div>

        {/* Formato */}
        <div style={styles.formatCard}>
          <div style={styles.formatLabel}>Formato da partida</div>
          <div style={styles.formatOpts}>
            <div
              style={{...styles.formatOpt, ...(format === '90' ? styles.formatOptSelected : {})}}
              onClick={() => setFormat('90')}
            >
              <div style={styles.formatIcon}>⏱️</div>
              <div style={styles.formatTitle}>90 minutos</div>
              <div style={styles.formatSub}>Regulamentar</div>
            </div>
            <div
              style={{...styles.formatOpt, ...(format === '120' ? styles.formatOptSelected : {})}}
              onClick={() => setFormat('120')}
            >
              <div style={styles.formatIcon}>🥅</div>
              <div style={styles.formatTitle}>120 min + pênaltis</div>
              <div style={styles.formatSub}>Se empatar no fim</div>
            </div>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={{...styles.btnKick, ...(!canStart ? styles.btnDisabled : {})}}
          onClick={handleStart}
          disabled={!canStart}
        >
          {loading ? 'Simulando…' : 'Apitar partida ⚽'}
        </button>

      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { background: '#1a472a', padding: '32px 20px 24px', textAlign: 'center' },
  headerIcon: { fontSize: 32, marginBottom: 8 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 500, marginBottom: 4 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 },
  card: { background: '#f8f8f8', borderRadius: 12, padding: '12px 14px' },
  cardLabel: { fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  label: { fontSize: 12, color: '#666', display: 'block', marginBottom: 5 },
  select: { width: '100%', fontSize: 13, padding: '8px 10px', borderRadius: 8,
    border: '1px solid #ddd', background: 'white', color: '#333', outline: 'none' },
  preview: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
    padding: '8px 10px', background: 'white', borderRadius: 8, border: '1px solid #eee' },
  badge: { width: 36, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 },
  previewName: { fontSize: 13, fontWeight: 500, color: '#333' },
  vs: { textAlign: 'center', fontSize: 18, color: '#999' },
  formatCard: { background: '#f8f8f8', borderRadius: 12, padding: '12px 14px' },
  formatLabel: { fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 10 },
  formatOpts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  formatOpt: { border: '1px solid #ddd', borderRadius: 10, padding: '10px 8px',
    textAlign: 'center', cursor: 'pointer', background: 'white', transition: 'all .15s' },
  formatOptSelected: { border: '2px solid #1a472a', background: '#e8f5e9' },
  formatIcon: { fontSize: 20, marginBottom: 4 },
  formatTitle: { fontSize: 12, fontWeight: 500, color: '#333' },
  formatSub: { fontSize: 11, color: '#888', marginTop: 2 },
  error: { background: '#fce4e4', color: '#8b1a1a', borderRadius: 8,
    padding: '10px 12px', fontSize: 13, textAlign: 'center' },
  btnKick: { width: '100%', background: '#1a472a', color: 'white', border: 'none',
    borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  btnDisabled: { opacity: 0.35, cursor: 'default' },
}