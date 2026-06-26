import { computed } from 'vue'
import { todayStr } from '../stores/goals.js'

function dateFromStr(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function diffDays(a, b) {
  return Math.round((dateFromStr(a) - dateFromStr(b)) / 86400000)
}

export function useGoal(goalRef) {
  const today = todayStr()

  const cycleLength = 30

  const allDays = computed(() => {
    const goal = goalRef.value
    if (!goal) return []
    return Array.from({ length: cycleLength }, (_, i) => {
      const d = new Date(dateFromStr(goal.cycleStartDate))
      d.setDate(d.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return {
        dayNumber: i + 1,
        dateStr,
        status: getDayStatus(goal, dateStr)
      }
    })
  })

  function getDayStatus(goal, dateStr) {
    const entry = goal.entries[dateStr]
    const isFilled = entry && entry.plan && entry.done && entry.doBetter
    const isPlanned = entry && entry.plan && !(entry.done && entry.doBetter)
    if (dateStr === today) return isFilled ? 'filled' : (isPlanned ? 'planned' : 'today')
    if (dateStr > today) return isPlanned ? 'planned' : 'future'
    if (isFilled) return 'filled'
    if (isPlanned) return 'planned'
    return 'missed'
  }

  const completedCount = computed(() => {
    const goal = goalRef.value
    if (!goal) return 0
    return allDays.value.filter(d => {
      const entry = goal.entries[d.dateStr]
      return entry && entry.done
    }).length
  })

  const todayFilled = computed(() => {
    const goal = goalRef.value
    if (!goal) return false
    const entry = goal.entries[today]
    return !!(entry && entry.plan && entry.done && entry.doBetter)
  })

  const currentDayNumber = computed(() => {
    const goal = goalRef.value
    if (!goal) return 0
    const diff = diffDays(today, goal.cycleStartDate)
    return Math.min(Math.max(diff + 1, 1), cycleLength)
  })

  const isActive = computed(() => {
    const goal = goalRef.value
    if (!goal) return false
    const diff = diffDays(today, goal.cycleStartDate)
    return diff >= 0 && diff < cycleLength
  })

  return { allDays, completedCount, currentDayNumber, isActive, todayFilled }
}
