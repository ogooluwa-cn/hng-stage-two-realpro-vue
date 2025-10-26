<template>
  <header class="header">
    <nav class="nav">
      <div class="logo" @click="navigateTo('/')">RealPro</div>
      
      <!-- Mobile Menu Button -->
      <div 
        class="mobile-menu-btn"
        :class="{ 'active': mobileMenuOpen }"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div class="nav-links" :class="{ 'nav-links-active': mobileMenuOpen }">
        <!-- Dark/Light Mode Switch -->
        <div class="switch-container">
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="darkMode"
              @change="toggleDarkMode"
            />
            <span class="slider">
              <span class="slider-icon sun">☀️</span>
              <span class="slider-icon moon">🌙</span>
            </span>
          </label>
          <span class="switch-label">
            {{ darkMode ? 'Dark' : 'Light' }}
          </span>
        </div>
        
        <a @click="handleNavClick('/pages/dashboard')">Dashboard</a>
        <a @click="handleNavClick('/pages/ticket')">Ticket</a>
        
        <!-- Logout Button -->
        <div class="action-card" @click="handleLogoutClick">
          <h3 :class="{ 'logout-animation': logoutAnimation }">
            {{ logoutAnimation ? 'Logging out...' : 'Logout' }}
          </h3>
        </div>
      </div>

      <!-- Mobile Overlay -->
      <div 
        v-if="mobileMenuOpen" 
        class="mobile-overlay" 
        @click="closeMobileMenu"
      ></div>
    </nav>

    <!-- Logout Confirmation -->
    <div v-if="showLogoutConfirm" class="alert-overlay">
      <div class="alert-box">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>
        <div class="alert-buttons">
          <button class="btn-cancel" @click="cancelLogout">Cancel</button>
          <button class="btn-confirm" @click="confirmLogout">Yes, Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const darkMode = ref(false)
    const mobileMenuOpen = ref(false)
    const showLogoutConfirm = ref(false)
    const logoutAnimation = ref(false)

    // Logout function
    const logout = () => {
      // Remove user session from localStorage
      localStorage.removeItem('userSession');
      
      // Clear any other auth-related data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Dispatch event for other components to react to logout
      window.dispatchEvent(new Event('logout'));
    }

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        darkMode.value = true
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    })

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      
      if (darkMode.value) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    const handleNavClick = (path) => {
      closeMobileMenu()
      router.push(path)
    }

    const handleLogoutClick = () => {
      showLogoutConfirm.value = true
    }

    const confirmLogout = () => {
      showLogoutConfirm.value = false
      logoutAnimation.value = true
      
      setTimeout(() => {
        logout()
        alert('Logged out successfully!')
        router.push('/')
      }, 1000)
    }

    const cancelLogout = () => {
      showLogoutConfirm.value = false
    }

    return {
      darkMode,
      mobileMenuOpen,
      showLogoutConfirm,
      logoutAnimation,
      toggleDarkMode,
      toggleMobileMenu,
      closeMobileMenu,
      navigateTo,
      handleNavClick,
      handleLogoutClick,
      confirmLogout,
      cancelLogout
    }
  }
}
</script>