// ===== src/components/color/ColorCard.vue =====
<template>
  <div class="color-card" @click="handleCardClick">
    <div 
      class="color-card__preview"
      :style="{ backgroundColor: color.hex }"
    >
      <!-- 收藏按钮 -->
      <button
        @click.stop="handleFavoriteClick"
        class="color-card__favorite"
        :class="{ 'color-card__favorite--active': isFavorite }"
      >
        <HeartIcon 
          :class="[
            'w-5 h-5',
            isFavorite ? 'fill-current' : ''
          ]"
        />
      </button>
      
      <!-- 对比色文字 -->
      <div 
        class="color-card__hex"
        :style="{ color: color.contrast }"
      >
        {{ color.hex }}
      </div>
    </div>
    
    <div class="color-card__info">
      <div class="color-card__name">
        <h3>{{ color.chinese }}</h3>
        <p class="color-card__english">{{ color.english }}</p>
      </div>
      
      <div class="color-card__details">
        <p class="color-card__category">{{ color.category }}</p>
        <p class="color-card__rgb">
          RGB({{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }})
        </p>
        <p v-if="color.guofeng" class="color-card__guofeng">
          国风：{{ color.guofeng }}
        </p>
      </div>
      
      <!-- 标签 -->
      <div class="color-card__tags" v-if="color.tags.length > 0">
        <span
          v-for="tag in color.tags.slice(0, 3)"
          :key="tag"
          class="color-card__tag"
          :class="getTagClass(tag)"
        >
          {{ tag }}
        </span>
        <span v-if="color.tags.length > 3" class="color-card__tag-more">
          +{{ color.tags.length - 3 }}
        </span>
      </div>
      
      <!-- 操作按钮 -->
      <div class="color-card__actions">
        <BaseButton
          size="sm"
          variant="secondary"
          @click.stop="handleCopyHex"
        >
          复制 HEX
        </BaseButton>
        
        <BaseButton
          size="sm"
          variant="primary"
          @click.stop="handleViewDetails"
        >
          查看详情
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUIStore } from '@stores/uiStore'
import { HeartIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'view-details'])

const favoriteStore = useFavoriteStore()
const uiStore = useUIStore()

const isFavorite = computed(() => favoriteStore.isFavorite(props.color.hex))

const handleCardClick = () => {
  emit('click', props.color)
}

const handleFavoriteClick = () => {
  favoriteStore.toggleFavorite(props.color)
  const message = isFavorite.value ? '已添加到收藏' : '已从收藏中移除'
  uiStore.showToast(message, 'success', 2000)
}

const handleCopyHex = async () => {
  try {
    await navigator.clipboard.writeText(props.color.hex)
    uiStore.showToast('HEX 值已复制到剪贴板', 'success', 2000)
  } catch (error) {
    console.error('复制失败:', error)
    uiStore.showToast('复制失败，请手动复制', 'error')
  }
}

const handleViewDetails = () => {
  emit('view-details', props.color)
}

const getTagClass = (tag) => {
  if (tag.includes('时尚')) return 'color-card__tag--fashion'
  if (tag.includes('季')) return 'color-card__tag--season'
  if (tag.includes('风格')) return 'color-card__tag--style'
  return ''
}
</script>

<style lang="scss" scoped>
.color-card {
  @include card-style;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  &__preview {
    height: 120px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__favorite {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 1);
    }
    
    &--active {
      color: #e74c3c;
    }
  }
  
  &__hex {
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 600;
    font-size: 0.875rem;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  
  &__info {
    padding: 1rem;
  }
  
  &__name {
    margin-bottom: 0.5rem;
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
  }
  
  &__english {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    font-style: italic;
  }
  
  &__details {
    margin-bottom: 0.75rem;
    
    p {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0.125rem 0;
    }
  }
  
  &__category {
    font-weight: 500;
    color: #3498db !important;
  }
  
  &__guofeng {
    color: #e74c3c !important;
    font-weight: 500;
  }
  
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  
  &__tag {
    @extend .tag !optional;
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    
    &--fashion {
      background: #e91e63;
      color: white;
    }
    
    &--season {
      background: #27ae60;
      color: white;
    }
    
    &--style {
      background: #9b59b6;
      color: white;
    }
  }
  
  &__tag-more {
    font-size: 0.625rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  &__actions {
    display: flex;
    gap: 0.5rem;
  }
}

// 移动端优化
@media (max-width: 640px) {
  .color-card {
    &__actions {
      flex-direction: column;
    }
  }
}
</style>