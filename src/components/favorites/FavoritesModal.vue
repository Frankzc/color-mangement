<!-- 需要创建的 FavoritesModal.vue -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="favorites-modal">
      <div class="modal-header">
        <h2>我的收藏</h2>
        <button @click="$emit('close')" class="close-btn">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <div class="favorites-content">
        <div v-if="favoriteStore.favorites.length === 0" class="empty-favorites">
          <p>您还没有收藏任何颜色</p>
        </div>
        
        <div v-else class="favorites-grid">
          <div 
            v-for="color in favoriteStore.favorites" 
            :key="color.hex"
            class="favorite-item"
            @click="viewColor(color)"
          >
            <div 
              class="color-preview"
              :style="{ backgroundColor: color.hex }"
            >
              <button 
                @click.stop="removeFavorite(color)"
                class="remove-btn"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
            <div class="color-info">
              <h3>{{ color.chinese }}</h3>
              <p>{{ color.english }}</p>
              <p class="hex">{{ color.hex }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUiStore } from '@stores/uiStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'view-color'])

const favoriteStore = useFavoriteStore()
const uiStore = useUiStore()

const viewColor = (color) => {
  emit('view-color', color)
}

const removeFavorite = (color) => {
  favoriteStore.toggleFavorite(color)
  uiStore.showMessage(`已取消收藏 ${color.chinese}`, 'info')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.favorites-modal {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
}

.favorites-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-favorites {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.favorite-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.color-preview {
  height: 80px;
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    background: white;
    color: #ef4444;
  }
}

.color-info {
  padding: 12px;
  
  h3 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
  }
  
  p {
    margin: 0 0 2px 0;
    font-size: 12px;
    color: #6b7280;
  }
  
  .hex {
    font-family: monospace;
    font-weight: 500;
  }
}
</style>