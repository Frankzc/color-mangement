// ===== src/components/color/ColorGrid.vue =====
<template>
  <div class="color-grid">
    <ColorCard
      v-for="color in colors"
      :key="color.hex"
      :color="color"
      @click="$emit('color-click', color)"
      @view-details="$emit('color-details', color)"
    />
  </div>
</template>

<script setup>
import ColorCard from './ColorCard.vue'

defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

defineEmits(['color-click', 'color-details'])
</script>

<style lang="scss" scoped>
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
