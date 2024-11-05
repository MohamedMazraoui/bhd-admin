<script setup lang="ts">

import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div class="w-full h-full">
    <div class="h-full min-h-screen">
      <div class="relative h-full min-h-screen mx-auto" :class="route.name === 'caisse' ? '' : 'container sm:px-6 lg:px-8'">
        <slot />
      </div>
    </div>
  </div>
</template>
