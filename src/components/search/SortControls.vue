<!-- 修复后的 SortControls.vue -->
<template>
  <div class="fixed-sort-controls">
    <label class="fixed-sort-label">排序：</label>
    <select 
      :value="sortBy" 
      @change="handleSortChange"
      class="fixed-sort-select"
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
      class="fixed-sort-order"
      :title="sortOrder === 'asc' ? '升序' : '降序'"
    >
      <ArrowUpIcon v-if="sortOrder === 'asc'" class="sort-icon" />
      <ArrowDownIcon v-else class="sort-icon" />
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
.fixed-sort-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.fixed-sort-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.fixed-sort-select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 1px rgba(52, 152, 219, 0.1);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: auto;
  }
}

.fixed-sort-order {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
}

.sort-icon {
  width: 14px;
  height: 14px;
}
</style>