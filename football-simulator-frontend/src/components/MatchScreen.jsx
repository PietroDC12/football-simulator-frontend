import { useState, useEffect, useRef } from 'react'
import { playSound } from '../useSound'

const EVENT_SPEED_MS = 4500

const EVENT_ICONS = {
  kickoff: '⚽',
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  foul: '⚠️',
  corner: '🚩',
  halftime: '⏸️',
  halftime_extra: '⏸️',
  extratime: '⏰',
  penalties_start: '🥅',
  penalty_goal: '✅',
  penalty_miss: '❌',
  penalty_winner: '🏆',
  fulltime: '🏁',
}

export default function MatchScreen({ matchData, onReset }) {
  const [visibleEvents, setVisibleEvents] = useState([])
  const [currentScore, setCurrentScore] = useState({ home: 0, away: 0 })
  const [currentMinute, setCurrentMinute] = useState('')
  const [fieldMsg, setFieldMsg] = useState('⚽ Jogo em andamento…')
  const [goalFlash, setGoalFlash] = useState('')
  const [finished, setFinished] = useState(false)
  const [stats, setStats] = useState({
    home: { possession: 50, shots: 0, corners: 0, fouls: 0 },
    away: { possession: 50, shots: 0, corners: 0, fouls: 0 },
  })

  const indexRef = useRef(0)
  const intervalRef = useRef(null)
  const liveStats = useRef({
    home: { shots: 0, corners: 0, fouls: 0, possession: 50 },
    away: { shots: 0, corners: 0, fouls: 0, possession: 50 },
  })

  const { home, away, events } = matchData

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (indexRef.current >= events.length) {
        clearInterval(intervalRef.current)
        setFinished(true)
        return
      }

      const ev = events[indexRef.current]
      indexRef.current++

      // ─── Atualiza estatísticas ao vivo ──────────────────
      const side = ev.team === home.id ? 'home' : 'away'
      const ls = liveStats.current

      if (ev.type === 'goal') {
        ls[side].shots++
      } else if (ev.type === 'corner') {
        ls[side].corners++
      } else if (ev.type === 'foul' || ev.type === 'yellow_card' || ev.type === 'red_card') {
        ls[side].fouls++
      }

      // Posse flutua levemente a cada evento
      ls.home.possession = Math.min(70, Math.max(30,
        ls.home.possession + (Math.random() - 0.5) * 3
      ))
      ls.away.possession = 100 - ls.home.possession

      setStats({
        home: { ...ls.home },
        away: { ...ls.away },
      })

      // ─── Atualiza eventos visíveis ──────────────────────
      setVisibleEvents(prev => [ev, ...prev].slice(0, 20))

      // ─── Minuto ─────────────────────────────────────────
      setCurrentMinute(
        ev.minute === 999 ? 'Fim' :
        ev.minute === 45  ? '45\'' :
        ev.minute === 105 ? '105\'' :
        `${ev.minute}'`
      )

      // ─── Campo e sons ───────────────────────────────────
      if (ev.type === 'kickoff') {
        setFieldMsg('⚽ Jogo em andamento…')
        playSound('kickoff')
      } else if (ev.type === 'goal') {
        const [h, a] = ev.score.split('-').map(Number)
        setCurrentScore({ home: h, away: a })
        setFieldMsg(`🎉 GOL de ${ev.player}!`)
        setGoalFlash(`⚽ GOL! ${ev.player} — ${ev.score}`)
        setTimeout(() => setGoalFlash(''), 3000)
        playSound('goal')
      } else if (ev.type === 'halftime' || ev.type === 'halftime_extra') {
        setFieldMsg('⏸️ Intervalo')
        setCurrentMinute('Intervalo')
        playSound('whistle')
      } else if (ev.type === 'extratime') {
        setFieldMsg('⏰ Prorrogação!')
        playSound('whistle')
      } else if (ev.type === 'penalties_start') {
        setFieldMsg('🥅 Pênaltis!')
        playSound('whistle')
      } else if (ev.type === 'yellow_card') {
        setFieldMsg(`🟨 Cartão amarelo — ${ev.player}`)
        playSound('card')
      } else if (ev.type === 'red_card') {
        setFieldMsg(`🟥 Cartão vermelho — ${ev.player}`)
        playSound('card')
      } else if (ev.type === 'foul') {
        playSound('foul')
      } else if (ev.type === 'penalty_winner') {
        setFieldMsg(`🏆 ${ev.description}`)
        playSound('fulltime')
      } else if (ev.type === 'fulltime') {
        setFieldMsg(`🏁 ${ev.description}`)
        setCurrentMinute('Fim')
        playSound('fulltime')
      }

    }, EVENT_SPEED_MS)

    return () => clearInterval(intervalRef.current)
  }, [])

  const tc = (a, b) => Math.max(a + b, 1)

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div style={styles.teamsRow}>
          <span style={styles.teamName}>{home.name}</span>
          <span style={styles.scoreBig}>{currentScore.home} - {currentScore.away}</span>
          <span style={{...styles.teamName, textAlign: 'right'}}>{away.name}</span>
        </div>
        <div style={styles.headerCenter}>
          <div style={styles.minutePill}>{currentMinute || 'Aguardando…'}</div>
        </div>
      </div>

      <div style={styles.fieldStrip}>
        <span>{fieldMsg}</span>
      </div>

      {goalFlash && <div style={styles.goalFlash}>{goalFlash}</div>}

      <div style={styles.body}>

        <div>
          <div style={styles.sectionTitle}>Estatísticas</div>
          {[
            { label: 'Posse',
              h: Math.round(stats.home.possession) + '%',
              a: Math.round(stats.away.possession) + '%',
              ph: stats.home.possession,
              pa: stats.away.possession },
            { label: 'Chutes',
              h: stats.home.shots, a: stats.away.shots,
              ph: stats.home.shots / tc(stats.home.shots, stats.away.shots) * 100,
              pa: stats.away.shots / tc(stats.home.shots, stats.away.shots) * 100 },
            { label: 'Escanteios',
              h: stats.home.corners, a: stats.away.corners,
              ph: stats.home.corners / tc(stats.home.corners, stats.away.corners) * 100,
              pa: stats.away.corners / tc(stats.home.corners, stats.away.corners) * 100 },
            { label: 'Faltas',
              h: stats.home.fouls, a: stats.away.fouls,
              ph: stats.home.fouls / tc(stats.home.fouls, stats.away.fouls) * 100,
              pa: stats.away.fouls / tc(stats.home.fouls, stats.away.fouls) * 100 },
          ].map(stat => (
            <div key={stat.label} style={styles.statRow}>
              <span style={styles.statVal}>{stat.h}</span>
              <div style={styles.barWrap}>
                <div style={{...styles.barHome, width: stat.ph + '%'}} />
              </div>
              <span style={styles.statLabel}>{stat.label}</span>
              <div style={styles.barWrap}>
                <div style={{...styles.barAway, width: stat.pa + '%'}} />
              </div>
              <span style={{...styles.statVal, textAlign: 'right'}}>{stat.a}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={styles.sectionTitle}>Eventos</div>
          {visibleEvents.length === 0 && (
            <div style={styles.noEvents}>O jogo vai começar…</div>
          )}
          {visibleEvents.map((ev, i) => (
            <div key={i} style={styles.eventItem}>
              <span style={styles.evMin}>
                {ev.minute === 999 ? 'FIM' :
                 ev.minute === 45  ? '45\'' :
                 ev.minute === 105 ? '105\'' :
                 `${ev.minute}'`}
              </span>
              <span style={styles.evIcon}>{EVENT_ICONS[ev.type] || '•'}</span>
              <div style={styles.evText}>
                {ev.description}
                {ev.score && <div style={styles.evSub}>Placar: {ev.score}</div>}
              </div>
            </div>
          ))}
        </div>

        {finished && (
          <button style={styles.btnReset} onClick={onReset}>
            🔄 Novo jogo
          </button>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: { background: '#1a472a', padding: '18px 16px 14px', flexShrink: 0 },
  teamsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  teamName: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500, flex: 1 },
  scoreBig: { fontSize: 38, fontWeight: 500, color: 'white', minWidth: 90,
    textAlign: 'center', letterSpacing: 5 },
  headerCenter: { textAlign: 'center', marginTop: 6 },
  minutePill: { background: 'rgba(255,255,255,0.18)', borderRadius: 20,
    padding: '3px 14px', fontSize: 12, color: 'white', display: 'inline-block' },
  fieldStrip: { background: '#2d6a3f', padding: '10px 16px', textAlign: 'center',
    color: 'white', fontSize: 13, fontWeight: 500, minHeight: 42,
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  goalFlash: { background: '#fff9c4', borderLeft: '3px solid #f9a825',
    padding: '8px 12px', fontSize: 13, fontWeight: 500,
    color: '#5d4037', textAlign: 'center' },
  body: { flex: 1, overflowY: 'auto', padding: '12px 16px',
    display: 'flex', flexDirection: 'column', gap: 12 },
  sectionTitle: { fontSize: 11, color: '#888', textTransform: 'uppercase',
    letterSpacing: 0.5, fontWeight: 600, marginBottom: 8 },
  statRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, fontSize: 12 },
  statVal: { minWidth: 30, fontWeight: 500, color: '#333' },
  barWrap: { flex: 1, height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden' },
  barHome: { height: '100%', background: '#1a472a', borderRadius: 3, transition: 'width .4s' },
  barAway: { height: '100%', background: '#8b1a1a', borderRadius: 3, transition: 'width .4s' },
  statLabel: { fontSize: 11, color: '#888', textAlign: 'center', minWidth: 68 },
  eventItem: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0',
    borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  evMin: { color: '#aaa', fontSize: 11, minWidth: 26, paddingTop: 2 },
  evIcon: { fontSize: 16, minWidth: 22 },
  evText: { color: '#333', lineHeight: 1.4, flex: 1 },
  evSub: { fontSize: 11, color: '#888', marginTop: 2 },
  noEvents: { color: '#aaa', fontSize: 13, textAlign: 'center', padding: '16px 0' },
  btnReset: { width: '100%', background: 'transparent', border: '1px solid #ddd',
    borderRadius: 10, padding: 12, fontSize: 13, cursor: 'pointer',
    color: '#333', marginTop: 4 },
}