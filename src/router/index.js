// ===== src/router/index.js =====
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

// 懒加载页面组件
const SearchView = () => import('../views/SearchView.vue')
const ColorExtractView = () => import('../views/ColorExtractView.vue')
const ColorWheelView = () => import('../views/ColorWheelView.vue')
const FavoritesView = () => import('../views/FavoritesView.vue')
const ProfileView = () => import('../views/ProfileView.vue')
const LoginView = () => import('../views/LoginView.vue')

const routes = [
  {
    path: '/',
    name: 'Search',
    component: SearchView,
    meta: {
      title: '颜色搜索',
      description: '智能搜索和筛选颜色',
      transition: 'fade'
    }
  },
  {
    path: '/extract',
    name: 'ColorExtract',
    component: ColorExtractView,
    meta: {
      title: '图片取色',
      description: '从图片中提取颜色',
      transition: 'slide'
    }
  },
  {
    path: '/wheel',
    name: 'ColorWheel',
    component: ColorWheelView,
    meta: {
      title: '色环选色',
      description: '使用色环选择颜色',
      transition: 'slide'
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesView,
    meta: {
      title: '我的收藏',
      description: '管理收藏的颜色和配色方案',
      requiresAuth: true,
      transition: 'slide'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      title: '个人中心',
      description: '个人设置和偏好',
      requiresAuth: true,
      transition: 'fade'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: '用户登录',
      description: '登录到颜色管理系统'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 时装设计师颜色管理系统`
  }
  
  // 检查认证
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isAuthenticated) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router