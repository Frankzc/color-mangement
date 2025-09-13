<!-- src/components/color/ColorDetailModal.vue -->
<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ color?.chinese || '颜色详情' }}</h2>
        <button @click="$emit('close')" class="close-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-if="color" class="modal-body">
        <!-- 颜色预览 -->
        <div class="color-preview" :style="{ backgroundColor: color.hex }">
          <div class="color-info">
            <h3>{{ color.chinese }}</h3>
            <p>{{ color.english }}</p>
            <p>{{ color.hex }}</p>
          </div>
        </div>
        
        <!-- 颜色参数 -->
        <div class="color-params">
          <div class="param-group">
            <h4>RGB</h4>
            <p>{{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }}</p>
          </div>
          <div class="param-group">
            <h4>CMYK</h4>
            <p>{{ color.cmyk.c }}%, {{ color.cmyk.m }}%, {{ color.cmyk.y }}%, {{ color.cmyk.k }}%</p>
          </div>
          <div class="param-group" v-if="color.hsl">
            <h4>HSL</h4>
            <p>{{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%</p>
          </div>
          <div class="param-group" v-if="color.guofeng && color.guofeng !== 'null'">
            <h4>国风色彩</h4>
            <p>{{ color.guofeng }}</p>
          </div>
        </div>
        
        <!-- 标签 -->
        <div v-if="color.tags && color.tags.length" class="color-tags">
          <h4>标签</h4>
          <div class="tags">
            <span v-for="tag in color.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.modal-body {
  padding: 1.5rem;
}

.color-preview {
  height: 150px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 1.5rem;
  
  .color-info {
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    border-radius: 0.5rem;
    backdrop-filter: blur(4px);
    
    h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
  }
}

.color-params {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.param-group {
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    font-family: monospace;
  }
}

.color-tags {
  h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  border: 1px solid #e5e7eb;
}
</style>