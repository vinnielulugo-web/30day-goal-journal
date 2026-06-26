<template>
  <div class="form-card" ref="cardRef">
    <div class="form-header">
      <div>
        <h3 class="form-title">今日记录</h3>
        <p class="form-date">{{ formattedDate }} · 第 {{ currentDayNumber }} 天</p>
      </div>
      <span v-if="saved" class="saved-badge">已保存 ✓</span>
    </div>

    <div class="field-group">
      <label class="field-label done-label">✅ 今日完成 Done</label>
      <textarea
        v-model="form.done"
        class="field-input"
        placeholder="今天做了什么？有什么收获或成果？"
        rows="3"
        @blur="autoSave"
      />
    </div>

    <div class="field-group">
      <label class="field-label better-label">🔍 可以更好 Do Better</label>
      <textarea
        v-model="form.doBetter"
        class="field-input"
        placeholder="有什么做得不够好的地方？"
        rows="3"
        @blur="autoSave"
      />
    </div>

    <div class="field-group">
      <label class="field-label tomorrow-label">🌅 明天计划 Tomorrow</label>
      <textarea
        v-model="form.tomorrow"
        class="field-input"
        placeholder="明天打算怎么做？"
        rows="3"
        @blur="autoSave"
      />
    </div>

    <div class="form-actions">
      <button class="btn-primary" @click="saveNow">保存记录</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, toRef } from 'vue'
import { useGoalsStore, todayStr } from '../stores/goals.js'
import { useGoal } from '../composables/useGoal.js'

const props = defineProps({ goal: { type: Object, required: true } })
const cardRef = ref(null)

const store = useGoalsStore()
const goalRef = toRef(props, 'goal')
const { currentDayNumber } = useGoal(goalRef)

const today = todayStr()
const saved = ref(false)
let saveTimer = null

const existing = computed(() => props.goal.entries[today] || {})

const form = reactive({
  done: existing.value.done || '',
  doBetter: existing.value.doBetter || '',
  tomorrow: existing.value.tomorrow || '',
})

watch(() => props.goal.entries[today], (entry) => {
  if (!entry) return
  if (entry.done !== undefined) form.done = entry.done
  if (entry.doBetter !== undefined) form.doBetter = entry.doBetter
  if (entry.tomorrow !== undefined) form.tomorrow = entry.tomorrow
}, { deep: true })

const formattedDate = computed(() => {
  const [y, m, d] = today.split('-')
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`
})

function autoSave() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(doSave, 600)
}

function saveNow() {
  clearTimeout(saveTimer)
  doSave()
}

function doSave() {
  store.saveEntry(props.goal.id, today, {
    done: form.done,
    doBetter: form.doBetter,
    tomorrow: form.tomorrow,
  })
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

defineExpose({ scrollIntoView: () => cardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }) })
</script>

<style scoped>
.form-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  animation: fadeIn 0.3s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.form-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.form-date {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.saved-badge {
  font-size: 0.75rem;
  color: #6aad7e;
  background: #edf7f0;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  flex-shrink: 0;
}

.field-group {
  margin-bottom: 1.1rem;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--text-secondary);
}

.field-input {
  width: 100%;
  background: var(--bg-sunken);
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: var(--amber-400); }
.field-input::placeholder { color: var(--text-muted); }

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
</style>
