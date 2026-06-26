<template>
  <div class="goal-card" @click="$emit('select')">
    <div class="card-header">
      <div class="card-info">
        <h2 class="goal-title">{{ goal.title }}</h2>
        <p class="goal-meta">
          <span v-if="isActive">第 {{ currentDayNumber }} 天 / 30 天</span>
          <span v-else-if="completedCount === 30">已完成旅程 🎉</span>
          <span v-else>旅程已结束</span>
        </p>
      </div>
      <ProgressRing :completed="completedCount" :total="30" :size="60" />
    </div>
    <div class="mini-timeline">
      <div
        v-for="day in allDays"
        :key="day.dayNumber"
        class="mini-dot"
        :class="day.status"
      />
    </div>
    <div class="card-footer">
      <span class="streak-text">已打卡 {{ completedCount }} 天</span>
      <button class="btn-ghost delete-btn" @click.stop="$emit('delete')" title="删除目标">✕</button>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import ProgressRing from './ProgressRing.vue'
import { useGoal } from '../composables/useGoal.js'

const props = defineProps({ goal: { type: Object, required: true } })
defineEmits(['select', 'delete'])

const goalRef = toRef(props, 'goal')
const { allDays, completedCount, currentDayNumber, isActive } = useGoal(goalRef)
</script>

<style scoped>
.goal-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: box-shadow 0.2s, transform 0.15s;
  animation: fadeIn 0.3s ease;
}
.goal-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.goal-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
  line-height: 1.3;
}

.goal-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.mini-timeline {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 0.9rem;
}

.mini-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid var(--border-light);
}
.mini-dot.filled { background: var(--dot-filled); border-color: var(--dot-filled); }
.mini-dot.missed { background: var(--dot-missed); border-color: var(--dot-missed); }
.mini-dot.today  { background: var(--dot-today); border-color: var(--dot-today); }
.mini-dot.future { background: transparent; }
.mini-dot.planned { background: var(--bg-sunken); border-color: var(--amber-400); border-style: dashed; }

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.streak-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.delete-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s;
}
.goal-card:hover .delete-btn { opacity: 1; }
</style>
