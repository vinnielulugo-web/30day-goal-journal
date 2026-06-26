<template>
  <div class="timeline">
    <div class="timeline-header">
      <span class="timeline-label">30 天旅程</span>
      <span class="timeline-count">{{ completedCount }} / 30 天</span>
    </div>
    <div class="dots-grid">
      <DayDot
        v-for="day in allDays"
        :key="day.dayNumber"
        :dayNumber="day.dayNumber"
        :status="day.status"
        :label="day.dateStr"
        :selected="day.dateStr === selectedDate"
        @click="handleDayClick(day)"
      />
    </div>
  </div>
</template>

<script setup>
import DayDot from './DayDot.vue'
import { useGoal } from '../composables/useGoal.js'
import { toRef } from 'vue'

const props = defineProps({
  goal: { type: Object, required: true },
  selectedDate: { type: String, default: null },
})
const emit = defineEmits(['dayClick'])

const goalRef = toRef(props, 'goal')
const { allDays, completedCount } = useGoal(goalRef)

function handleDayClick(day) {
  emit('dayClick', day.dateStr)
}
</script>

<style scoped>
.timeline {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timeline-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.timeline-count {
  font-size: 0.8rem;
  color: var(--amber-500);
  font-weight: 500;
}

.dots-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}

@media (max-width: 480px) {
  .dots-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
