const sounds = {}

function getSound(name) {
  if (!sounds[name]) {
    sounds[name] = new Audio(`/sounds/${name}.mp3`)
    sounds[name].volume = 0.7
  }
  return sounds[name]
}

export function playSound(type) {
  const map = {
    goal:            'goal',
    penalty_goal:    'goal',
    kickoff:         'whistle',
    halftime:        'halftime',
    halftime_extra:  'halftime',
    fulltime:        'fulltime',
    penalty_winner:  'fulltime',
    foul:            'foul',
    yellow_card:     'foul',
    red_card:        'foul',
    penalties_start: 'whistle',
  }

  const soundName = map[type]
  if (!soundName) return

  try {
    const audio = getSound(soundName)
    audio.currentTime = 0
    audio.play().catch(() => {})
  } catch (e) {}
}