<template>
  <div class="entry-panel">
    <div class="panel-header">
      <div>
        <h3 class="panel-title">{{ formattedDate }}</h3>
        <p class="panel-meta">第 {{ dayNumber }} 天<span v-if="isFuture" class="future-tag"> · 未来计划</span></p>
      </div>
      <button class="close-btn" @click="$emit('close')" aria-label="关闭">✕</button>
    </div>

    <div class="field-group">
      <label class="field-label">📋 当天计划</label>
      <textarea
        v-model="form.plan"
        class="field-input"
        placeholder="今天打算做什么？"
        rows="3"
        @input="markDirty"
      />
    </div>

    <div class="field-group">
      <label class="field-label">✅ 完成的</label>
      <textarea
        v-model="form.done"
        class="field-input"
        placeholder="今天完成了什么？"
        rows="3"
        @input="markDirty"
      />
    </div>

    <div class="field-group">
      <label class="field-label">🔍 可以做的更好的</label>
      <textarea
        v-model="form.doBetter"
        class="field-input"
        placeholder="有什么地方可以改进？"
        rows="3"
        @input="markDirty"
      />
    </div>

    <div class="panel-actions">
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
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useGoalsStore, todayStr } from '../stores/goals.js'

const props = defineProps({
  goal: { type: Object, required: true },
  dateStr: { type: String, required: true },
})
const emit = defineEmits(['close', 'milestone'])

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
  isDirty.value = false
  hasSaved.value = true
}, { deep: true })

// 切换日期时重置表单
watch(() => props.dateStr, () => {
  const e = props.goal.entries[props.dateStr] || {}
  form.plan = e.plan || ''
  form.done = e.done || ''
  form.doBetter = e.doBetter || ''
  isDirty.value = false
  hasSaved.value = Object.keys(e).length > 0
})

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

const MILESTONES = {
  1:  { day: 1,  icon: '🌱', message: '种子已种下' },
  7:  { day: 7,  icon: '🌿', message: '成长正在发生' },
  15: { day: 15, icon: '🔥', message: '你已经超过很多半途而废的人' },
  21: { day: 21, icon: '⛰️', message: '改变开始变得真实' },
  30: { day: 30, icon: '🏆', message: '恭喜抵达彼岸' },
}

function countDoneDays() {
  return Object.values(props.goal.entries).filter(e => e && e.done).length
}

function doSave() {
  const hadDoneBefore = !!(props.goal.entries[props.dateStr]?.done)
  store.saveEntry(props.goal.id, props.dateStr, {
    plan: form.plan,
    done: form.done,
    doBetter: form.doBetter,
  })
  isDirty.value = false
  hasSaved.value = true

  // 只在本次新增了 done 内容时才检查里程碑（避免重复触发）
  if (form.done && !hadDoneBefore) {
    const total = countDoneDays()
    if (MILESTONES[total]) {
      emit('milestone', MILESTONES[total])
    }
  }
}
</script>

<style scoped>
.entry-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  animation: fadeIn 0.2s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--border-light);
}

.panel-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.panel-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.future-tag {
  color: var(--amber-500);
}

.close-btn {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.close-btn:hover {
  background: var(--bg-sunken);
  color: var(--text-primary);
}

.field-group {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  color: var(--text-secondary);
}

.field-input {
  width: 100%;
  background: var(--bg-sunken);
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 0.65rem 0.9rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: var(--amber-400); }
.field-input::placeholder { color: var(--text-muted); }

.panel-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
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
