// ===== src/components/favorites/ColorSchemeCard.vue =====
<template>
  <div class="color-scheme-card">
    <!-- 配色预览 -->
    <div class="scheme-preview">
      <div
        v-for="color in scheme.colors.slice(0, 5)"
        :key="color.hex || color"
        class="scheme-color"
        :style="{ backgroundColor: color.hex || color }"
        :title="color.chinese || color"
      ></div>
      <div v-if="scheme.colors.length > 5" class="scheme-more">
        +{{ scheme.colors.length - 5 }}
      </div>
    </div>

    <!-- 方案信息 -->
    <div class="scheme-info">
      <h3 class="scheme-name">{{ scheme.name }}</h3>
      <p v-if="scheme.description" class="scheme-description">
        {{ scheme.description }}
      </p>
      
      <div class="scheme-meta">
        <span class="color-count">{{ scheme.colors.length }} 个颜色</span>
        <span class="created-date">{{ formatDate(scheme.createdAt) }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="scheme-actions">
        <button @click="$emit('view', scheme)" class="action-btn action-btn--primary">
          查看
        </button>
        <button @click="$emit('edit', scheme)" class="action-btn action-btn--secondary">
          编辑
        </button>
        <button @click="handleDelete" class="action-btn action-btn--danger">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scheme: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const handleDelete = () => {
  if (confirm(`确定要删除配色方案"${props.scheme.name}"吗？`)) {
    emit('delete', props.scheme)
  }
}
</script>

<style lang="scss" scoped>
.color-scheme-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  }
}

.scheme-preview {
  height: 80px;
  display: flex;
  
  .scheme-color {
    flex: 1;
    min-width: 0;
  }
  
  .scheme-more {
    width: 60px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
  }
}

.scheme-info {
  padding: 1rem;
}

.scheme-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.scheme-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scheme-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.scheme-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &--primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &--secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &--danger {
    background: #fef2f2;
    color: #dc2626;
    
    &:hover {
      background: #fee2e2;
    }
  }
}
</style>