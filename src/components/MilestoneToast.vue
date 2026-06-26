<template>
  <Teleport to="body">
    <div class="toast-overlay" @click="$emit('close')">
      <div class="toast-card" :class="`milestone-${milestone.day}`">
        <div class="toast-icon">{{ milestone.icon }}</div>
        <div class="toast-day">Day {{ milestone.day }}</div>
        <div class="toast-message">{{ milestone.message }}</div>
        <div class="toast-hint">点击任意处关闭</div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  milestone: { type: Object, required: true }, // { day, icon, message }
})
defineEmits(['close'])
</script>

<style scoped>
.toast-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 18, 10, 0.55);
  backdrop-filter: blur(3px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayIn 0.3s ease;
}

.toast-card {
  text-align: center;
  padding: 2.5rem 3rem;
  border-radius: 24px;
  max-width: 320px;
  width: 88%;
  background: var(--bg-surface);
  box-shadow: 0 8px 40px rgba(30, 18, 10, 0.3);
  animation: cardBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-icon {
  font-size: 3.5rem;
  margin-bottom: 0.6rem;
  animation: iconPop 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.toast-day {
  font-family: 'Lora', Georgia, serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--amber-500);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.toast-message {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 1.5rem;
}

.toast-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Day 30 special gold glow */
.milestone-30 {
  background: linear-gradient(145deg, #fff8ec, #fff3db);
  border: 1px solid var(--amber-400);
}
.milestone-30 .toast-message {
  color: var(--terracotta);
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cardBounce {
  from { opacity: 0; transform: scale(0.7) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes iconPop {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
