<template>
  <GoalDetailView
    v-if="currentGoalId"
    :goalId="currentGoalId"
    @back="currentGoalId = null"
  />
  <HomeView
    v-else
    @selectGoal="currentGoalId = $event"
  />
</template>

<script setup>
import { ref } from 'vue'
import HomeView from './views/HomeView.vue'
import GoalDetailView from './views/GoalDetailView.vue'

const currentGoalId = ref(null)
</script>
