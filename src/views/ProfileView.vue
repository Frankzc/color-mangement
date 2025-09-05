</script>

<style lang="scss" scoped>
.profile-view {
  min-height: 100vh;
  background: #f8fafc;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-image, .avatar-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  color: #9ca3af;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
}

.edit-icon {
  width: 16px;
  height: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.user-role {
  font-size: 18px;
  color: #3b82f6;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.user-stats {
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.stat-item {
  .stat-label {
    font-size: 12px;
    color: #6b7280;
    margin-right: 8px;
  }
  
  .stat-value {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.profile-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
  
  @media (max-width: 1024px) {
    padding: 16px;
  }
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  @media (max-width: 1024px) {
    flex-direction: row;
    overflow-x: auto;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  &--active {
    background: #dbeafe;
    color: #2563eb;
  }
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.profile-main {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-content {
  padding: 32px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.section-card {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.profile-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }
  
  .form-input, .form-select, .form-textarea {
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
    
    &:disabled {
      background: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }
  
  .save-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  .cancel-button {
    padding: 12px 24px;
    background: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #e5e7eb;
    }
  }
}

// 偏好设置样式
.preferences-grid {
  display: grid;
  gap: 32px;
}

.pref-group {
  .pref-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #f3f4f6;
  }
}

.pref-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pref-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.pref-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.pref-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.pref-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
}

// 活动记录样式
.activity-filters {
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.activity-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    width: 20px;
    height: 20px;
    color: #3b82f6;
  }
}

.activity-content {
  flex: 1;
}

.activity-description {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

.activity-details {
  font-size: 12px;
  color: #374151;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

// 统计数据样式
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    width: 24px;
    height: 24px;
  }
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

// 分类统计样式
.category-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 120px;
  font-size: 14px;
}

.category-name {
  color: #374151;
}

.category-count {
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .profile-header {
    padding: 20px;
  }
  
  .user-name {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
}
</style><template>
  <div class="profile-view">
    <MainNav />