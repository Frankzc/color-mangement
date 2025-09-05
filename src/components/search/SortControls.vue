// ===== src/components/search/SortControls.vue =====
<template>
  <div class="sort-controls">
    <label class="sort-controls__label">排序方式：</label>
    <select 
      :value="sortBy" 
      @change="handleSortChange"
      class="sort-controls__select"
    >
      <option
        v-for="option in sortOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <button
      @click="toggleSortOrder"
      class="sort-controls__order"
      :title="sortOrder === 'asc' ? '升序' : '降序'"
    >
      <ArrowUpIcon v-if="sortOrder === 'asc'" class="w-4 h-4" />
      <ArrowDownIcon v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import { SORT_OPTIONS } from '@utils/constants'

const colorStore = useColorStore()

const sortBy = computed(() => colorStore.sortBy)
const sortOrder = computed(() => colorStore.sortOrder)
const sortOptions = SORT_OPTIONS

const handleSortChange = (event) => {
  colorStore.setSorting(event.target.value, sortOrder.value)
}

const toggleSortOrder = () => {
  colorStore.toggleSortOrder()
}
</script>

<style lang="scss" scoped>
.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &__label {
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
  }
  
  &__select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }
  }
  
  &__order {
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: #3498db;
      color: #3498db;
    }
  }
}
</style>