<template>
  <div class="drawer-backdrop" @click.self="$emit('close')">
    <div class="drawer" role="dialog" :aria-label="`${formattedDate} 的记录`">
      <div class="drawer-header">
        <div>
          <h3 class="drawer-title">{{ formattedDate }}</h3>
          <p class="drawer-meta">第 {{ dayNumber }} 天 <span v-if="isFuture" class="future-tag">· 未来</span></p>
        </div>
        <button class="btn-ghost close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="field-group">
        <label class="field-label plan-label">📋 当天计划</label>
        <textarea
          v-model="form.plan"
          class="field-input"
          placeholder="今天打算做什么？"
          rows="3"
          @input="markDirty"
        />
      </div>

      <div class="field-group">
        <label class="field-label done-label">✅ 完成的</label>
        <textarea
          v-model="form.done"
          class="field-input"
          placeholder="今天完成了什么？"
          rows="3"
          @input="markDirty"
        />
      </div>

      <div class="field-group">
        <label class="field-label better-label">🔍 可以做的更好的</label>
        <textarea
          v-model="form.doBetter"
          class="field-input"
          placeholder="有什么地方可以改进？"
          rows="3"
          @input="markDirty"
        />
      </div>

      <div class="drawer-actions">
        <button
          class="btn-primary save-btn"
          :disabled="!isDirty"
          :class="{ saved: !isDirty && hasSaved }"
          @click="doSave"
        >
          {{ !isDirty && hasSaved ? '已保存 ✓' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useGoalsStore } from '../stores/goals.js'
import { todayStr } from '../stores/goals.js'

const props = defineProps({
  goal: { type: Object, required: true },
  dateStr: { type: String, required: true },
})
defineEmits(['close'])

const store = useGoalsStore()
const today = todayStr()

const entry = computed(() => props.goal.entries[props.dateStr] || {})
const isFuture = computed(() => props.dateStr > today)

const form = reactive({
  plan: entry.value.plan || '',
  done: entry.value.done || '',
  doBetter: entry.value.doBetter || '',
})

const isDirty = ref(false)
const hasSaved = ref(Object.keys(entry.value).length > 0)

watch(() => props.goal.entries[props.dateStr], (e) => {
  if (!e) return
  form.plan = e.plan || ''
  form.done = e.done || ''
  form.doBetter = e.doBetter || ''
}, { deep: true })

const formattedDate = computed(() => {
  const [y, m, d] = props.dateStr.split('-')
  return `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`
})

const dayNumber = computed(() => {
  const start = new Date(...props.goal.cycleStartDate.split('-').map((v, i) => i === 1 ? v - 1 : +v))
  const cur = new Date(...props.dateStr.split('-').map((v, i) => i === 1 ? v - 1 : +v))
  return Math.round((cur - start) / 86400000) + 1
})

function markDirty() {
  isDirty.value = true
}

function doSave() {
  store.saveEntry(props.goal.id, props.dateStr, {
    plan: form.plan,
    done: form.done,
    doBetter: form.doBetter,
  })
  isDirty.value = false
  hasSaved.value = true
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(61, 43, 31, 0.25);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  background: var(--bg-surface);
  width: min(440px, 100%);
  height: 100%;
  overflow-y: auto;
  padding: 1.75rem 1.5rem;
  box-shadow: -4px 0 24px rgba(61, 43, 31, 0.12);
  animation: slideInRight 0.25s ease;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.drawer-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.drawer-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.future-tag {
  color: var(--text-muted);
}

.close-btn { font-size: 0.85rem; }

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

.drawer-actions {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  min-width: 88px;
  transition: background 0.15s, opacity 0.15s;
}

.save-btn:disabled {
  background: var(--border-medium);
  cursor: default;
  opacity: 0.7;
}

.save-btn.saved:disabled {
  background: #a8d5b5;
  color: #fff;
  opacity: 1;
}
</style>
