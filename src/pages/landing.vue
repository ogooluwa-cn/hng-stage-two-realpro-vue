<template>
  <div class="page active" id="landingPage">
    <section class="hero">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="circle circle-4"></div>
      <div class="container">
        <div class="hero-content">
          <h1>Streamline Your Ticket Management</h1>
          <p>Efficiently handle support tickets with RealPro's powerful and intuitive platform designed for modern teams.</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" @click="navigateTo('/page/login')">Get Started</button>
            <button class="btn btn-secondary" @click="navigateTo('/page/signup')">Sign Up Free</button>
          </div>
        </div>
      </div>
      <div class="wave"></div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Choose RealPro?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎫</div>
            <h3>Smart Ticket Management</h3>
            <p>Create, track, and resolve tickets with our intuitive workflow designed for efficiency.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Monitor performance with live dashboards and detailed reporting.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Enterprise Security</h3>
            <p>Bank-level security with role-based access control and audit logs.</p>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="container">
        <p>&copy; 2025 RealPro UI Design. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Landing',
  setup() {
    const router = useRouter()
    const darkMode = ref(false)

    // Initialize theme from localStorage
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme === "dark") {
        darkMode.value = true
        document.documentElement.setAttribute("data-theme", "dark")
      } else {
        darkMode.value = false
        document.documentElement.setAttribute("data-theme", "light")
      }
    }

    // Listen for theme changes from navbar
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme")
      darkMode.value = currentTheme === "dark"
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    onMounted(() => {
      initializeTheme()

      // Listen for storage changes (when navbar toggles theme)
      window.addEventListener('storage', handleThemeChange)
    })

    onUnmounted(() => {
      window.removeEventListener('storage', handleThemeChange)
    })

    return {
      darkMode,
      navigateTo
    }
  }
}
</script>

<style scoped>
/* Your existing land.css styles will work as-is */
</style>