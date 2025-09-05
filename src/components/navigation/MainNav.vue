// ===== src/components/navigation/MainNav.vue =====
<template>
  <nav class="main-nav">
    <div class="main-nav__container">
      <!-- Logo -->
      <div class="main-nav__logo">
        <router-link to="/" class="main-nav__brand">
          <h1 class="main-nav__title">Fashion Color</h1>
          <p class="main-nav__subtitle">时装设计师颜色管理系统</p>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <div class="main-nav__menu" :class="{ 'main-nav__menu--open': mobileMenuOpen }">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="main-nav__item"
          @click="closeMobileMenu"
        >
          <component :is="item.icon" class="main-nav__icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
      
      <!-- 用户操作 -->
      <div class="main-nav__actions">
        <!-- 收藏计数 -->
        <div class="main-nav__favorites" v-if="favoriteStore.favoriteCount > 0">
          <router-link to="/favorites" class="main-nav__favorites-link">
            <HeartIcon class="w-5 h-5" />
            <span class="main-nav__favorites-count">{{ favoriteStore.favoriteCount }}</span>
          </router-link>
        </div>
        
        <!-- 用户菜单 -->
        <div class="main-nav__user" v-if="userStore.isAuthenticated">
          <button @click="toggleUserMenu" class="main-nav__user-button">
            <UserCircleIcon class="w-6 h-6" />
          </button>
          
          <!-- 用户下拉菜单 -->
          <div v-if="userMenuOpen" class="main-nav__user-menu">
            <router-link to="/profile" class="main-nav__user-item">
              个人中心
            </router-link>
            <button @click="handleLogout" class="main-nav__user-item">
              退出登录
            </button>
          </div>
        </div>
        
        <!-- 登录按钮 -->
        <router-link v-else to="/login" class="main-nav__login">
          登录
        </router-link>
        
        <!-- 移动端菜单按钮 -->
        <button
          @click="toggleMobileMenu"
          class="main-nav__mobile-toggle"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoriteStore } from '@stores/favoriteStore'
import { useUserStore } from '@stores/userStore'
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  SwatchIcon,  // 改为 SwatchIcon
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const navItems = [
  {
    name: 'search',
    path: '/',
    label: '颜色搜索',
    icon: MagnifyingGlassIcon
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
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.main-nav__user')) {
    userMenuOpen.value = false
  }
  if (!event.target.closest('.main-nav__menu') && !event.target.closest('.main-nav__mobile-toggle')) {
    mobileMenuOpen.value = false
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  
  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    
    @media (min-width: 1024px) {
      padding: 0 2rem;
    }
  }
  
  &__logo {
    flex-shrink: 0;
  }
  
  &__brand {
    display: block;
    text-decoration: none;
    color: inherit;
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.2;
  }
  
  &__subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    line-height: 1;
  }
  
  &__menu {
    display: none;
    gap: 2rem;
    
    @media (min-width: 768px) {
      display: flex;
    }
    
    // 移动端菜单
    @media (max-width: 767px) {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      flex-direction: column;
      padding: 1rem;
      gap: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      
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
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s;
    
    &:hover {
      color: #3498db;
      background: #f1f5f9;
    }
    
    &.router-link-active {
      color: #3498db;
      background: #dbeafe;
    }
    
    @media (max-width: 767px) {
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
      border-radius: 0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__favorites {
    position: relative;
  }
  
  &__favorites-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    text-decoration: none;
    color: #e74c3c;
    border-radius: 0.5rem;
    transition: all 0.2s;
    
    &:hover {
      background: #fef2f2;
    }
  }
  
  &__favorites-count {
    background: #e74c3c;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1.25rem;
    text-align: center;
  }
  
  &__user {
    position: relative;
  }
  
  &__user-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    color: #6b7280;
    transition: all 0.2s;
    
    &:hover {
      color: #3498db;
      background: #f1f5f9;
    }
  }
  
  &__user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    min-width: 8rem;
    z-index: 50;
  }
  
  &__user-item {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #374151;
    background: none;
    border: none;
    text-align: left;
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
  
  &__login {
    @include button-style(#3498db);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    text-decoration: none;
  }
  
  &__mobile-toggle {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
    
    @media (min-width: 768px) {
      display: none;
    }
  }
}
</style>