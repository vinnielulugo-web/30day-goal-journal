<template>
  <button
    class="day-dot"
    :class="[status, 'clickable', { selected }]"
    :title="label"
    @click="$emit('click')"
  >
    <span class="day-number">{{ dayNumber }}</span>
  </button>
</template>

<script setup>
defineProps({
  dayNumber: { type: Number, required: true },
  status: { type: String, required: true },
  label: { type: String, default: '' },
  selected: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<style scoped>
.day-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  padding: 0;
}

.day-number {
  font-size: 0.6rem;
  color: var(--text-muted);
  font-weight: 500;
  user-select: none;
}

.day-dot.filled {
  background: var(--dot-filled);
  border-color: var(--dot-filled);
}
.day-dot.filled .day-number { color: #fff; }

.day-dot.missed {
  background: var(--dot-missed);
  border-color: var(--dot-missed);
}
.day-dot.missed .day-number { color: #fff; }

.day-dot.today {
  background: var(--dot-today);
  border-color: var(--dot-today);
  animation: pulse 2s ease-in-out infinite;
}
.day-dot.today .day-number { color: #fff; }

/* 只写了计划，未完成 */
.day-dot.planned {
  background: var(--bg-sunken);
  border-color: var(--amber-400);
  border-style: dashed;
}
.day-dot.planned .day-number { color: var(--amber-500); }

.day-dot.clickable:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(61, 43, 31, 0.2);
}

.day-dot.selected {
  outline: 3px solid var(--terracotta);
  outline-offset: 2px;
}
</style>
