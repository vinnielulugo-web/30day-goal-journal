<template>
  <div class="landing">
    <div class="content">
      <div class="brand">
        <span class="brand-sub">彼岸</span>
        <span class="brand-en">Beyond 30</span>
      </div>

      <div class="lines">
        <p class="line" :class="{ visible: step >= 1 }">这个不是你需要一辈子的坚持</p>
        <p class="line accent" :class="{ visible: step >= 2 }">你只需要 <em>30 天</em>的认真</p>
        <div class="divider" :class="{ visible: step >= 3 }"></div>
        <p class="line small" :class="{ visible: step >= 3 }">每一天的记录，都是在向彼岸靠近一步</p>
        <p class="line small" :class="{ visible: step >= 4 }">当 30 天结束时</p>
        <p class="line small highlight" :class="{ visible: step >= 5 }">你会重新认识自己</p>
      </div>

      <button
        class="start-btn"
        :class="{ visible: step >= 6 }"
        @click="$emit('enter')"
      >
        👉 启程
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineEmits(['enter'])

const step = ref(0)
const timers = []

onMounted(() => {
  const delays = [300, 900, 1700, 2400, 3100, 3900]
  delays.forEach((d, i) => {
    timers.push(setTimeout(() => { step.value = i + 1 }, d))
  })
})

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Brand */
.brand {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.brand-sub {
  font-family: 'Lora', Georgia, serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--terracotta);
  line-height: 1;
}

.brand-en {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Lines */
.lines {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.line {
  font-size: 1.05rem;
  color: var(--text-primary);
  line-height: 1.6;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.line.visible {
  opacity: 1;
  transform: translateY(0);
}

.line.accent {
  font-size: 1.2rem;
  color: var(--text-primary);
}

.line.accent em {
  font-style: normal;
  color: var(--terracotta);
  font-family: 'Lora', Georgia, serif;
  font-weight: 600;
}

.line.small {
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.line.highlight {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.05rem;
  color: var(--terracotta);
  font-weight: 600;
}

.divider {
  width: 0;
  height: 1px;
  background: var(--border-medium);
  margin: 0.3rem 0;
  transition: width 0.8s ease;
}

.divider.visible {
  width: 48px;
}

/* CTA */
.start-btn {
  align-self: flex-start;
  background: var(--terracotta);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease, background 0.15s;
}

.start-btn.visible {
  opacity: 1;
  transform: translateY(0);
}

.start-btn:hover {
  background: var(--amber-500);
}

.start-btn:active {
  transform: scale(0.97);
}
</style>
