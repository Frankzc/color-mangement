<!-- src/components/navigation/MainNav.vue -->
<template>
  <nav class="main-nav">
    <div class="main-nav__container">
      <!-- Logo -->
      <div class="main-nav__logo">
        <router-link to="/" class="main-nav__brand">
          <div class="main-nav__icon">
            <SwatchIcon class="w-8 h-8" />
          </div>
          <div class="main-nav__text">
            <h1 class="main-nav__title">Fashion Color</h1>
            <p class="main-nav__subtitle">时装设计师颜色管理系统</p>
          </div>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <div class="main-nav__menu" :class="{ 'main-nav__menu--open': mobileMenuOpen }">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="main-nav__item"
          :class="{ 'main-nav__item--active': isActiveRoute(item.path) }"
          @click="closeMobileMenu"
        >
          <component :is="item.icon" class="main-nav__icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
      
      <!-- 用户操作区域 -->
      <div class="main-nav__actions">
        <!-- 收藏按钮 - 修复小心心图标 -->
        <div class="main-nav__favorites">
          <router-link to="/favorites" class="main-nav__favorites-link">
            <HeartIcon class="w-5 h-5" />
            <span v-if="favoriteStore.favoriteCount > 0" class="main-nav__favorites-count">
              {{ favoriteStore.favoriteCount }}
            </span>
          </router-link>
        </div>
        
        <!-- 用户菜单 -->
        <div class="main-nav__user" v-if="userStore.isAuthenticated">
          <button @click="toggleUserMenu" class="main-nav__user-button">
            <UserIcon class="w-6 h-6" />
            <span class="main-nav__user-name">{{ userStore.user.name }}</span>
          </button>
          
          <!-- 用户下拉菜单 -->
          <div v-if="userMenuOpen" class="main-nav__user-menu">
            <router-link to="/profile" class="main-nav__user-item" @click="userMenuOpen = false">
              <UserIcon class="w-4 h-4" />
              <span>个人中心</span>
            </router-link>
            <button @click="handleLogout" class="main-nav__user-item">
              <LogoutIcon class="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
        
        <!-- 登录按钮（未登录时显示） -->
        <router-link v-else to="/login" class="main-nav__login">
          登录
        </router-link>
        
        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="main-nav__mobile-toggle md:hidden"
        >
          <MenuIcon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useUserStore } from '@/stores/userStore'
import { useUIStore } from '@/stores/uiStore'

// 内联 SVG 图标组件
const SearchIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>`
}

const PhotoIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`
}

const SwatchIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01" />
  </svg>`
}

const HeartIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>`
}

const UserIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>`
}

const LogoutIcon = {
  template: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>`
}

const MenuIcon = {
  template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`
}

const XIcon = {
  template: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>`
}

const route = useRoute()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const navItems = [
  {
    name: 'search',
    path: '/',
    label: '颜色搜索',
    icon: SearchIcon
  },
  {
    name: 'extract',
    path: '/extract',
    label: '图片取色',
    icon: PhotoIcon
  },
  {
    name: 'wheel',
    path: '/wheel',
    label: '色环选色',
    icon: SwatchIcon
  },
  {
    name: 'favorites',
    path: '/favorites',
    label: '我的收藏',
    icon: HeartIcon
  }
]

const isActiveRoute = (path) => {
  return route.path === path
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  userStore.logout()
  userMenuOpen.value = false
  uiStore.showMessage('已成功退出登录', 'success')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.main-nav__user')
  if (userMenu && !userMenu.contains(event.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.main-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
  }
  
  &__logo {
    flex-shrink: 0;
  }
  
  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #111827;
    
    &:hover {
      color: #3b82f6;
    }
  }
  
  &__icon {
    color: #3b82f6;
  }
  
  &__text {
    display: flex;
    flex-direction: column;
    
    @media (max-width: 640px) {
      display: none;
    }
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }
  
  &__subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.2;
  }
  
  &__menu {
    display: flex;
    align-items: center;
    gap: 2rem;
    
    @media (max-width: 768px) {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      flex-direction: column;
      gap: 0;
      padding: 1rem 0;
      display: none;
      
      &--open {
        display: flex;
      }
    }
  }
  
  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #6b7280;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-weight: 500;
    
    &:hover {
      color: #3b82f6;
      background: #f1f5f9;
    }
    
    &--active {
      color: #3b82f6;
      background: #eff6ff;
      
      .main-nav__icon {
        color: #3b82f6;
      }
    }
    
    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__favorites {
    position: relative;
    
    &-link {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0.5rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: all 0.2s;
      
      &:hover {
        color: #ef4444;
        background: #fef2f2;
      }
    }
    
    &-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 0.75rem;
      min-width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
  }
  
  &__user {
    position: relative;
  }
  
  &__user-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: #3b82f6;
      background: #f8fafc;
    }
  }
  
  &__user-name {
    font-size: 0.875rem;
    font-weight: 500;
    
    @media (max-width: 640px) {
      display: none;
    }
  }
  
  &__user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    min-width: 160px;
    overflow: hidden;
    z-index: 100;
  }
  
  &__user-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    text-decoration: none;
    color: #374151;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
  }
  
  &__login {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &__mobile-toggle {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    
    &:hover {
      color: #3b82f6;
      background: #f1f5f9;
    }
    
    @media (min-width: 769px) {
      display: none;
    }
  }
}
</style>