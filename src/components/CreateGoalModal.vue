<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true" aria-label="创建新目标">
      <h2 class="modal-title">开始新旅程</h2>
      <p class="modal-hint">给你的 30 天目标起个名字</p>
      <input
        ref="inputRef"
        v-model="title"
        class="goal-input"
        type="text"
        placeholder="例如：每天读20页书"
        maxlength="60"
        @keydown.enter="submit"
        @keydown.esc="$emit('close')"
      />
      <div class="modal-actions">
        <button class="btn-ghost" @click="$emit('close')">取消</button>
        <button class="btn-primary" :disabled="!title.trim()" @click="submit">出发 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close', 'create'])

const title = ref('')
const inputRef = ref(null)

onMounted(() => inputRef.value?.focus())

function submit() {
  if (!title.value.trim()) return
  emit('create', title.value.trim())
  title.value = ''
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(61, 43, 31, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-md);
  animation: fadeIn 0.25s ease;
}

.modal-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.4rem;
  color: var(--terracotta);
  margin-bottom: 0.4rem;
}

.modal-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
}

.goal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--border-light);
  background: var(--bg-sunken);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 1.25rem;
}
.goal-input:focus { border-color: var(--amber-400); }
.goal-input::placeholder { color: var(--text-muted); }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
