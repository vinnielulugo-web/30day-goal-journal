<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle
      :cx="center" :cy="center" :r="radius"
      fill="none"
      :stroke="trackColor"
      :stroke-width="strokeWidth"
    />
    <circle
      :cx="center" :cy="center" :r="radius"
      fill="none"
      :stroke="fillColor"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      transform-origin="center"
      :style="{ transform: 'rotate(-90deg)', transformOrigin: `${center}px ${center}px` }"
    />
    <text
      :x="center" :y="center + 5"
      text-anchor="middle"
      :fill="textColor"
      :font-size="fontSize"
      font-family="Inter, sans-serif"
      font-weight="500"
    >{{ completed }}/{{ total }}</text>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  completed: { type: Number, default: 0 },
  total: { type: Number, default: 30 },
  size: { type: Number, default: 56 },
  strokeWidth: { type: Number, default: 4 },
})

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth * 2) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => {
  const progress = props.total > 0 ? props.completed / props.total : 0
  return circumference.value * (1 - progress)
})
const trackColor = '#e8d5c0'
const fillColor = '#f59e0b'
const textColor = '#3d2b1f'
const fontSize = computed(() => props.size * 0.22)
</script>
