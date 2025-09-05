// ===== src/views/ProfileView.vue =====
<template>
  <div class="profile-view">
    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="profile-info">
        <div class="avatar">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
          <div v-else class="avatar-placeholder">
            <UserCircleIcon class="w-16 h-16 text-gray-400" />
          </div>
        </div>
        <div class="user-details">
          <h1 class="user-name">{{ user.name }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <p class="login-time">
            登录时间: {{ formatDate(user.loginTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <HeartIcon class="w-8 h-8 text-red-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ favoriteStore.favoriteCount }}</div>
          <div class="stat-label">收藏颜色</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <ColorSwatchIcon class="w-8 h-8 text-blue-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ favoriteStore.schemeCount }}</div>
          <div class="stat-label">配色方案</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <MagnifyingGlassIcon class="w-8 h-8 text-green-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ searchHistory.length }}</div>
          <div class="stat-label">搜索记录</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <ClockIcon class="w-8 h-8 text-purple-500" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ daysActive }}</div>
          <div class="stat-label">活跃天数</div>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <div class="settings-section">
      <h2 class="section-title">个人偏好设置</h2>
      
      <div class="settings-grid">
        <!-- 显示偏好 -->
        <div class="setting-card">
          <h3 class="setting-title">显示偏好</h3>
          <div class="setting-content">
            <div class="setting-item">
              <label class="setting-label">默认视图模式</label>
              <select 
                v-model="preferences.defaultView"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="grid">网格视图</option>
                <option value="list">列表视图</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">默认排序方式</label>
              <select 
                v-model="preferences.sortBy"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="name">按名称排序</option>
                <option value="hue">按色相排序</option>
                <option value="brightness">按亮度排序</option>
                <option value="saturation">按饱和度排序</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label class="setting-label">每页显示数量</label>
              <select 
                v-model="preferences.pageSize"
                @change="updatePreferences"
                class="setting-select"
              >
                <option value="12">12个</option>
                <option value="24">24个</option>
                <option value="48">48个</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 收藏偏好 -->
        <div class="setting-card">
          <h3 class="setting-title">收藏偏好</h3>
          <div class="setting-content">
            <div class="setting-item">
              <label class="setting-label">偏爱的颜色分类</label>
              <div class="checkbox-group">
                <label 
                  v-for="category in colorStore.categories"
                  :key="category"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :value="category"
                    v-model="preferences.favoriteCategories"
                    @change="updatePreferences"
                  />
                  <span>{{ category }}</span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="preferences.showGuofengFirst"
                  @change="updatePreferences"
                />
                <span>优先显示国风颜色</span>
              </label>
            </div>
            
            <div class="setting-item">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  v-model="preferences.autoSaveSchemes"
                  @change="updatePreferences"
                />
                <span>自动保存配色方案</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="data-section">
      <h2 class="section-title">数据管理</h2>
      
      <div class="data-actions">
        <div class="action-card">
          <div class="action-info">
            <h3>导出数据</h3>
            <p>导出您的收藏颜色和配色方案</p>
          </div>
          <BaseButton @click="exportData" variant="primary">
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            导出
          </BaseButton>
        </div>
        
        <div class="action-card">
          <div class="action-info">
            <h3>导入数据</h3>
            <p>从备份文件恢复数据</p>
          </div>
          <div class="import-actions">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleFileImport"
              style="display: none"
            />
            <BaseButton @click="$refs.fileInput.click()" variant="secondary">
              <ArrowUpTrayIcon class="w-4 h-4 mr-2" />
              导入
            </BaseButton>
          </div>
        </div>
        
        <div class="action-card danger">
          <div class="action-info">
            <h3>清除数据</h3>
            <p>清除所有收藏和偏好设置</p>
          </div>
          <BaseButton @click="clearAllData" variant="danger">
            <TrashIcon class="w-4 h-4 mr-2" />
            清除
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <h2 class="section-title">最近活动</h2>
      
      <div class="activity-list">
        <div 
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">
            <component :is="activity.icon" class="w-5 h-5" />
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ formatDate(activity.time) }}</span>
          </div>
        </div>
        
        <div v-if="recentActivity.length === 0" class="empty-activity">
          <p>暂无活动记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@stores/userStore'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useColorStore } from '@stores/colorStore'
import { useUiStore } from '@stores/uiStore'
import {
  UserCircleIcon,
  HeartIcon,
  ColorSwatchIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@components/common/BaseButton.vue'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()
const colorStore = useColorStore()
const uiStore = useUiStore()

// 响应式数据
const searchHistory = ref([])
const recentActivity = ref([])
const preferences = ref({
  defaultView: 'grid',
  sortBy: 'name',
  pageSize: 24,
  favoriteCategories: [],
  showGuofengFirst: false,
  autoSaveSchemes: true
})

// 计算属性
const user = computed(() => userStore.user)
const daysActive = computed(() => {
  if (!user.value?.loginTime) return 0
  const loginDate = new Date(user.value.loginTime)
  const now = new Date()
  const diffTime = Math.abs(now - loginDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// 方法
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const updatePreferences = () => {
  userStore.updatePreferences(preferences.value)
  uiStore.showToast('偏好设置已保存', 'success')
}

const exportData = () => {
  const data = {
    user: user.value,
    favorites: favoriteStore.exportData(),
    preferences: preferences.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `profile-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  uiStore.showToast('数据导出成功', 'success')
}

const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (data.favorites) {
      favoriteStore.importData(data.favorites)
    }
    
    if (data.preferences) {
      preferences.value = { ...preferences.value, ...data.preferences }
      updatePreferences()
    }
    
    uiStore.showToast('数据导入成功', 'success')
  } catch (error) {
    console.error('导入失败:', error)
    uiStore.showToast('导入失败，请检查文件格式', 'error')
  }
}

const clearAllData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    favoriteStore.clearFavorites()
    preferences.value = {
      defaultView: 'grid',
      sortBy: 'name',
      pageSize: 24,
      favoriteCategories: [],
      showGuofengFirst: false,
      autoSaveSchemes: true
    }
    updatePreferences()
    
    uiStore.showToast('所有数据已清除', 'success')
  }
}

const loadRecentActivity = () => {
  // 模拟最近活动数据
  recentActivity.value = [
    {
      id: 1,
      icon: HeartIcon,
      text: '收藏了颜色：航空蓝',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 2,
      icon: MagnifyingGlassIcon,
      text: '搜索了"红色"',
      time: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 3,
      icon: ColorSwatchIcon,
      text: '创建了配色方案：春日暖阳',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ]
}

onMounted(() => {
  // 加载用户偏好
  const userPrefs = userStore.getPreference('all', {})
  preferences.value = { ...preferences.value, ...userPrefs }
  
  // 加载活动记录
  loadRecentActivity()
})
</script>

<style lang="scss" scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    @media (max-width: 640px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .user-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  .user-email {
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .login-time {
    font-size: 0.875rem;
    color: #9ca3af;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .stat-icon {
    flex-shrink: 0;
  }
  
  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 3rem;
}

.settings-grid {
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.setting-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  
  .setting-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .setting-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .setting-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .setting-select {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }
  }
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 150px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  input[type="checkbox"] {
    accent-color: #3498db;
  }
}

.data-section {
  margin-bottom: 3rem;
}

.data-actions {
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.action-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  
  &.danger {
    border: 1px solid #fecaca;
    background: #fef2f2;
  }
  
  .action-info {
    flex: 1;
    
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    p {
      font-size: 0.875rem;
      color: #6b7280;
    }
  }
  
  .import-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.activity-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  .activity-icon {
    width: 2rem;
    height: 2rem;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-text {
      font-size: 0.875rem;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .activity-time {
      font-size: 0.75rem;
      color: #9ca3af;
    }
  }
}

.empty-activity {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .settings-grid,
  .data-actions {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
}