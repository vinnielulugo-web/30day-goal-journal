import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'goal_journey_data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.goals) ? parsed.goals : []
  } catch {
    return []
  }
}

function saveToStorage(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ goals }))
}

export const useGoalsStore = defineStore('goals', () => {
  const goals = ref(loadFromStorage())

  function addGoal(title) {
    const today = todayStr()
    const goal = {
      id: 'g_' + Date.now(),
      title,
      createdAt: today,
      cycleStartDate: today,
      entries: {}
    }
    goals.value.unshift(goal)
    persist()
    return goal.id
  }

  function deleteGoal(id) {
    goals.value = goals.value.filter(g => g.id !== id)
    persist()
  }

  function saveEntry(goalId, dateStr, { plan, done, doBetter }) {
    const goal = goals.value.find(g => g.id === goalId)
    if (!goal) return
    goal.entries[dateStr] = { date: dateStr, plan, done, doBetter }
    persist()
  }

  function getGoalById(id) {
    return goals.value.find(g => g.id === id) || null
  }

  function persist() {
    saveToStorage(goals.value)
  }

  return { goals, addGoal, deleteGoal, saveEntry, getGoalById }
})

export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
