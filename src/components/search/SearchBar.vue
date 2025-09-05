// ===== src/components/search/SearchBar.vue =====
<template>
  <div class="search-bar">
    <div class="search-bar__input-group">
      <div class="search-bar__input-wrapper">
        <MagnifyingGlassIcon class="search-bar__search-icon" />
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="搜索颜色名称、HEX值、RGB值..."
          class="search-bar__input"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="search-bar__clear"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      
      <!-- 快速搜索建议 -->
      <div v-if="showSuggestions && suggestions.length > 0" class="search-bar__suggestions">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="selectSuggestion(suggestion)"
          class="search-bar__suggestion"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useColorStore } from '@stores/colorStore'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash-es'

const colorStore = useColorStore()

const searchQuery = ref('')
const showSuggestions = ref(false)

// 搜索建议
const suggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  const allSuggestions = [
    ...colorStore.colors.map(c => c.chinese),
    ...colorStore.colors.map(c => c.english),
    ...colorStore.categories,
    ...colorStore.allTags
  ]
  
  return allSuggestions
    .filter(item => item.toLowerCase().includes(query))
    .slice(0, 6)
})

// 防抖搜索
const debouncedSearch = debounce((query) => {
  colorStore.setSearchQuery(query)
}, 300)

const handleSearch = () => {
  debouncedSearch(searchQuery.value)
  showSuggestions.value = searchQuery.value.length >= 2
}

const clearSearch = () => {
  searchQuery.value = ''
  colorStore.setSearchQuery('')
  showSuggestions.value = false
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  colorStore.setSearchQuery(suggestion)
  showSuggestions.value = false
}

// 点击外部关闭建议
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-bar')) {
    showSuggestions.value = false
  }
}

document.addEventListener('click', handleClickOutside)
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
  
  &__input-group {
    position: relative;
  }
  
  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  &__search-icon {
    position: absolute;
    left: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    z-index: 1;
  }
  
  &__input {
    width: 100%;
    padding: 1rem 3rem 1rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    font-size: 1rem;
    transition: all 0.2s;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  &__clear {
    position: absolute;
    right: 1rem;
    background: #f3f4f6;
    border: none;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
  }
  
  &__suggestion {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
    
    &:first-child {
      border-radius: 0.5rem 0.5rem 0 0;
    }
    
    &:last-child {
      border-radius: 0 0 0.5rem 0.5rem;
    }
  }
}
</style>