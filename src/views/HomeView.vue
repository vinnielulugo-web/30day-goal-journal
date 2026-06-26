<template>
  <div class="home">
    <header class="home-header">
      <div class="header-content">
        <div class="brand-row">
          <h1 class="app-title">30天彼岸计划</h1>
          <span class="brand-en">Beyond 30</span>
        </div>
        <p class="app-sub1">你不需要一辈子的坚持，你只需要 <em>30 天</em>的认真</p>
        <p class="app-sub2">每一天的记录，都是在向彼岸靠近一步</p>
        <p class="app-sub2">当 30 天结束时，你会重新认识自己</p>
      </div>
      <button class="btn-primary new-btn" @click="showCreate = true">+ 新目标</button>
    </header>

    <main class="goals-list">
      <div v-if="goals.length === 0" class="empty-state">
        <div class="empty-icon">🌱</div>
        <p class="empty-title">还没有旅程</p>
        <p class="empty-hint">点击「新目标」开始你的第一次 30 天挑战</p>
      </div>
      <GoalCard
        v-for="goal in goals"
        :key="goal.id"
        :goal="goal"
        @select="$emit('selectGoal', goal.id)"
        @delete="confirmDelete(goal)"
      />
    </main>

    <CreateGoalModal
      v-if="showCreate"
      @close="showCreate = false"
      @create="createGoal"
    />

    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
      <div class="confirm-modal">
        <p class="confirm-text">确定删除「{{ deleteTarget.title }}」？<br><small>所有记录将不可恢复</small></p>
        <div class="confirm-actions">
          <button class="btn-ghost" @click="deleteTarget = null">取消</button>
          <button class="btn-danger" @click="doDelete">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGoalsStore } from '../stores/goals.js'
import { storeToRefs } from 'pinia'
import GoalCard from '../components/GoalCard.vue'
import CreateGoalModal from '../components/CreateGoalModal.vue'

const emit = defineEmits(['selectGoal'])

const store = useGoalsStore()
const { goals } = storeToRefs(store)

const showCreate = ref(false)
const deleteTarget = ref(null)

function createGoal(title) {
  const id = store.addGoal(title)
  showCreate.value = false
  emit('selectGoal', id)
}

function confirmDelete(goal) {
  deleteTarget.value = goal
}

function doDelete() {
  store.deleteGoal(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<style scoped>
.home {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.home-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2.5rem 0 2rem;
  gap: 1rem;
}

.brand-row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.app-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.6rem;
  color: var(--terracotta);
  font-weight: 600;
  line-height: 1.1;
}

.brand-en {
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.app-sub1 {
  font-size: 0.88rem;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
  line-height: 1.5;
}

.app-sub1 em {
  font-style: normal;
  color: var(--terracotta);
  font-family: 'Lora', Georgia, serif;
  font-weight: 600;
}

.app-sub2 {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.new-btn {
  flex-shrink: 0;
  margin-left: 1rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  animation: fadeIn 0.4s ease;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-title { font-family: 'Lora', serif; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.4rem; }
.empty-hint { font-size: 0.85rem; color: var(--text-muted); }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(61, 43, 31, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.confirm-modal {
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 320px;
  width: 90%;
  box-shadow: var(--shadow-md);
}
.confirm-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.confirm-text small { color: var(--text-muted); font-size: 0.8rem; }
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
