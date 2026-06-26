<template>
  <div class="detail">
    <header class="detail-header">
      <button class="back-btn" @click="$emit('back')">← 返回</button>
      <div class="header-info">
        <h2 class="goal-title">{{ goal.title }}</h2>
        <p class="goal-meta">
          <span v-if="isActive">第 {{ currentDayNumber }} 天 / 30 天 · 已完成 {{ completedCount }} 天</span>
          <span v-else>旅程已结束 · 共完成 {{ completedCount }} 天</span>
        </p>
      </div>
    </header>

    <div class="content">
      <GoalTimeline
        :goal="goal"
        :selectedDate="selectedDate"
        @dayClick="selectDate"
      />

      <DayEntryPanel
        v-if="selectedDate"
        :goal="goal"
        :dateStr="selectedDate"
        @close="selectedDate = null"
        @milestone="showMilestone"
      />

      <MilestoneToast
        v-if="activeMilestone"
        :milestone="activeMilestone"
        @close="activeMilestone = null"
      />

      <div v-else class="hint-card">
        <p>点击任意日期查看或填写记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGoalsStore, todayStr } from '../stores/goals.js'
import { useGoal } from '../composables/useGoal.js'
import GoalTimeline from '../components/GoalTimeline.vue'
import DayEntryPanel from '../components/DayEntryPanel.vue'
import MilestoneToast from '../components/MilestoneToast.vue'

const props = defineProps({ goalId: { type: String, required: true } })
defineEmits(['back'])

const store = useGoalsStore()
const goal = computed(() => store.getGoalById(props.goalId))
const goalRef = computed(() => goal.value)

const { currentDayNumber, completedCount, isActive } = useGoal(goalRef)

const selectedDate = ref(todayStr())
const activeMilestone = ref(null)
let milestoneTimer = null

function selectDate(dateStr) {
  selectedDate.value = selectedDate.value === dateStr ? null : dateStr
}

function showMilestone(m) {
  activeMilestone.value = m
  clearTimeout(milestoneTimer)
  milestoneTimer = setTimeout(() => { activeMilestone.value = null }, 4000)
}
</script>

<style scoped>
.detail {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
  min-height: 100vh;
}

.detail-header {
  padding: 1.5rem 0 1.5rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 1.5rem;
}

.back-btn {
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 0.75rem;
  transition: color 0.15s;
}
.back-btn:hover { color: var(--terracotta); }

.goal-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.4rem;
  color: var(--terracotta);
  font-weight: 600;
  line-height: 1.2;
}

.goal-meta {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hint-card {
  background: var(--bg-surface);
  border: 1px dashed var(--border-medium);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
}
</style>
